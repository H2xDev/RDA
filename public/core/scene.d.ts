import { Entity } from "./entity";
import { EventEmitter } from "./event";
export declare enum SceneEvents {
    LOAD = 0,
    DESTROY = 1
}
export declare class Scene extends EventEmitter<SceneEvents> {
    private entities;
    constructor();
    addEntity<T extends Entity>(entity: T, id?: string): T;
    private updateObjects;
    update(): void;
    start(): void;
    destroy(): void;
}
