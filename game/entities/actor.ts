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
    
    public position = V.Cr(0, 0); 

    constructor (
        protected collider: Matter.Body,
        protected spriteList: S,
    ) {
        super();
        this.prepareSprites();
        this.once(EntityEvents.SPAWN, () => this.preparePhysics());
        this.once(EntityEvents.SPAWN, this.start.bind(this));
    }


    public get sprite() {
        return this.spriteList[this.spriteIndex];
    }

    private preparePhysics() {
        Composite.add(this.scene.world, this.collider);
    }

    public prepareSprites() {
        const t = this.spriteList as ActorSpriteList;
        Object
            .entries(t)
            .forEach(([k, s]) => {
                t[k] = s.clone();
            })
    }
    
    public renderSprite() {
        if (!this.sprite) return;
        const { position, angle } = this.collider;
        const { x, y } = position;
       
        this.sprite.state.rotation = angle * 180 / Math.PI;
        this.sprite.render(x, y);
    }

    public update() {
        this.renderSprite();
    }

    public start() {}
}
