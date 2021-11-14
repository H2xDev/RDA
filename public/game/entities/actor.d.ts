import Matter from "matter-js";
import { Entity } from "../../core/entity";
import Sprite from "../../core/sprite";
interface ActorSpriteList {
    [k: string]: Sprite;
}
export declare abstract class Actor<S extends ActorSpriteList = any> extends Entity {
    protected collider: Matter.Body;
    protected spriteList: S;
    spriteIndex: keyof S;
    position: import("../../core/utils/vectorUtil").VectorLike;
    constructor(collider: Matter.Body, spriteList: S);
    get sprite(): S[keyof S];
    private preparePhysics;
    prepareSprites(): void;
    renderSprite(): void;
    update(): void;
    start(): void;
}
export {};
