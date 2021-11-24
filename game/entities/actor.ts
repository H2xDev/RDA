import Matter, {Composite} from "matter-js";
import { Entity, EntityEvents } from "../../core/entity";
import Sprite from "../../core/sprite";
import {V} from "../../core/utils/vectorUtil";

interface ActorOptions {
    collider: Matter.Body,
}

interface ActorSpriteList {
    [k: string]: Sprite;
}

export abstract class Actor<S extends ActorSpriteList = any> extends Entity {
    public spriteIndex: keyof S = 'default';

    protected rotateByBody = true;

    constructor (
        public body: Matter.Body,
        protected spriteList: S,
    ) {
        super();
        this.prepareSprites();
        this.once(EntityEvents.SPAWN, () => this.preparePhysics());
        this.once(EntityEvents.SPAWN, this.start.bind(this));
    }

    public get bodyPos() {
        return this.body.position;
    }

    public get sprite(): Sprite {
        return this.spriteList[this.spriteIndex];
    }

    private preparePhysics() {
        Composite.add(this.scene.world, this.body);
    }

    public prepareSprites() {
        const t = { ...this.spriteList } as ActorSpriteList;
        Object
            .entries(t)
            .forEach(([k, s]) => {
                t[k] = s.clone();
            });

        this.spriteList = t as S;
    }
    
    public renderSprite() {
        if (!this.sprite) return;
        const { position, angle } = this.body;
        const { x, y } = position;
        
        if (this.rotateByBody) {
            this.sprite.angle = -angle * 180 / Math.PI;
        }
        this.sprite.render(x, y);
    }

    public update() {
        this.renderSprite();
    }

    public start() {}
}
