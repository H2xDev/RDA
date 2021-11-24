import { EventEmitter } from "./event";
import { Scene } from "./scene";

export enum EntityEvents {
    SPAWN, DESTROY
}

export class Entity extends EventEmitter<EntityEvents> {
    protected scene!: Scene;

    public id!: string;

    public position = { x: 0, y: 0 };

    public update() {}

    public setScene<T extends Scene>(scene: T) {
        this.scene = scene;
    }
}
