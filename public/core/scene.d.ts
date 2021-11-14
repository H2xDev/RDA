import Matter from "matter-js";
import { Entity } from "./entity";
import { EventEmitter } from "./event";
export declare enum SceneEvents {
    LOAD = 0,
    DESTROY = 1
}
export declare class Scene extends EventEmitter<SceneEvents> {
    private entities;
    protected runner: Matter.Runner;
    engine: Matter.Engine;
    world: Matter.World;
    render: Matter.Render;
    constructor();
    addEntity<T extends Entity>(entity: T, id?: string): T;
    private updateObjects;
    update(): void;
    private preStart;
    start(): void;
    destroy(): void;
    private resetPhysics;
    postDestroy(): void;
}
