import { EventEmitter } from "./event";
import { Scene } from "./scene";
export declare enum EntityEvents {
    SPAWN = 0,
    DESTROY = 1
}
export declare class Entity extends EventEmitter<EntityEvents> {
    protected scene: Scene;
    position: {
        x: number;
        y: number;
    };
    update(): void;
    setScene<T extends Scene>(scene: T): void;
}
