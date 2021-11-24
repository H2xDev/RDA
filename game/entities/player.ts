import Matter, {IChamfer} from "matter-js";
import {Entity} from "../../core/entity";
import {KCodes, keyboardInput} from "../../core/input";
import Sprite from "../../core/sprite";
import {V, VectorLike} from "../../core/utils/vectorUtil";
import {context} from "../engine";
import {Character} from "./character";

const PLAYER_SPRITELIST = {
    default: new Sprite('player-idle.png', {
        frameSize: [42, 56], 
        offset: [21, 28],
        scale: [1, 1],
    }),
    run: new Sprite('player-run.png', {
        frameSize: [42, 56], 
        offset: [21, 28],
        scale: [1, 1],
    }),
    fly: new Sprite('player-fly.png', {
        frameSize: [42, 56],
        offset: [21, 28],
        scale: [1, 1],
    }),
};

const { sin, cos } = Math;

export class PlayersEyeTail extends Entity {
    private lifeTime = 1000;

    private args!: Parameters<CanvasRenderingContext2D['drawImage']>;
    
    private trns!: DOMMatrix;

    private ang!: number;

    private scale!: [number, number];

    private dateStart = Date.now();

    constructor(
        private pos: VectorLike,
        private dif: VectorLike,
        private spr: Sprite,
    ) {
        super();
        this.args = this.spr.frameDrawingArgs as typeof this.args;
        this.trns = { ...this.spr.transform };
        this.pos = { ...this.pos };
        this.ang = this.spr.angle;
        this.trns.e = 0;
        this.trns.f = 0;
        this.scale = [...this.spr.scale];
    }
    
    update() {
        const { args, trns, dif } = this;
        const [image] = args;

        const dist = V.Mag(dif);
        const angl = V.Ang(dif);

        const timeDiff = Date.now() - this.dateStart;
        const alpha = Math.max(0, 1 - timeDiff / 500);

       
        if (!alpha) {
            this.scene.destroyEntity(this);
        } 

        context.save();
        context.globalCompositeOperation = "screen";
        context.translate(this.pos.x, this.pos.y);
        context.rotate(this.ang / 180 * Math.PI);
        context.scale(...this.scale);
        context.translate(-this.spr.offset[0], -this.spr.offset[1]);
        context.globalAlpha = alpha / 10;

        const step = 0.25;
        for (let i = 0; i < dist; i+=step) {
            context.translate(cos(angl) * step, sin(angl) * step);
            context.drawImage(...args);
        }

        context.restore();
    }
}

export class Player extends Character {
    protected jumpSpeed = 10;

    private side = 1;

    private oldPosition: VectorLike | null = null;

    constructor() {
        super(
            Matter.Bodies.circle(0, 0, 28),
            PLAYER_SPRITELIST,
        );

        keyboardInput.on('down:32', this.jump.bind(this));
    }

    public spawnEyeTail() {
        if (this.oldPosition) {
            const diff = V.Sub(this.bodyPos, (this.body as any).positionPrev as VectorLike);
            const dist = V.Mag(diff);diff

            if (dist > 0.5) {
                this.scene.addEntity(
                    new PlayersEyeTail(this.bodyPos, diff, this.sprite));    
            }
        }


        this.oldPosition = this.bodyPos;
    }

    public update() {

        const left = keyboardInput.isPressed(KCodes.K_LEFT) ? 1 : 0;
        const right = keyboardInput.isPressed(KCodes.K_RIGHT) ? 1 : 0;
        const movementVector = Math.sign(right - left);
        this.move(movementVector / 1.5);

        if (this.isOnGround) {
            this.spriteIndex = Math.abs(this.body.velocity.x) > 1 ? 'run' : 'default'; 
            this.sprite.speed = 1;
        } else {
            this.spriteIndex = 'fly';
            this.sprite.speed = 0;
            const flyState = Math.sign(this.body.velocity.y) * 14;

            const targetFrame = 15 + flyState;
            this.sprite.frame -= (this.sprite.frame - targetFrame) / 4;
            const targetAngle = this.body.velocity.x * Math.sign(this.body.velocity.y) * -10;
            this.sprite.angle -= (this.sprite.angle - targetAngle) / 16;
        }

        this.side = movementVector || this.side;

        this.sprite.scale[0] = this.side;

        if (this.spriteIndex === 'run') {
            this.sprite.speed = Math.abs(this.body.velocity.x / 4);
        }

        this.spawnEyeTail();
        super.update();
    }
}
