import { SpriteGroup, SpriteOptions } from "../../core/sprite";
import { CharacterController } from "./characterController";
import { V } from "../../core/utils/vector2";

type CharacterSpriteStates = {
    idle: string;
    run: string;
    fly: string;
}

export class Character extends CharacterController {
    private spriteGroup!: SpriteGroup<CharacterSpriteStates>;

    constructor(private spriteName: string) {
        super();
        this.initSpriteGroup();
    }

    private initSpriteGroup() {
        const { spriteName } = this;
        const path = `${spriteName}/${spriteName}-`;
        const entries = ['idle', 'run', 'fly']
            .map(e => [e, path + e + '.png']);

        const spriteSet = Object.fromEntries(entries);
        const options: SpriteOptions = {
            frameSize: [32, 32],
            offset: [16, 16],
            scale: [1, 1],
            speed: 0.1,
        };

        this.spriteGroup = new SpriteGroup(spriteSet, options);
        this.spriteGroup.state = 'idle';

        this.initSpriteGroupConditions();
    }

    private initSpriteGroupConditions() {
        const { spriteGroup } = this;

        const runIdleCondition = (state: 'run' | 'idle') => {
            if (!this.isOnGround) return false;

            const { velocity, spriteGroup } = this;
            const { scale } = spriteGroup;

            switch (state) {
                case 'run':
                    return Math.abs(this.acceleration) > 0.5;
                case 'idle':
                    scale[0] = Math.sign(velocity.x) || scale[0];
                    this.spriteGroup.speed = Math.abs(this.velocity.x) / 8;
                    return Math.abs(this.acceleration) < 0.5;
            }
        }


        spriteGroup.condition('idle', runIdleCondition);
        spriteGroup.condition('run', runIdleCondition);
        spriteGroup.condition('fly', () => Math.abs(this.velocity.y) > 0.1);
    }

    public update() {
        super.update();
        this.spriteGroup.render(...V.asArray(this.position));
    }
}
