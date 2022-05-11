import { EventEmitter } from "./event";
import { Scene } from "./scene";

export enum EntityEvents {
    SPAWN, DESTROY
}

export interface ChildrenList {
    [id: string]: Entity;
}

export type OnlyMethods<T> = Pick<T, {
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T]>;



export class Entity extends EventEmitter<EntityEvents> {
    protected scene!: Scene;

    public id!: string;
    public position = { x: 0, y: 0 };
    protected isDebugging = false;
    protected debugColor = "#0f0";

    public update() {}

    public setScene<T extends Scene>(scene: T) {
        this.scene = scene;
    }

    public setDebug(state: boolean) {
        this.isDebugging = state;
    }

    static CallForAll<T extends keyof OnlyMethods<Entity>>(
        entitiesList: ChildrenList,
        method: T,
        ...args: Parameters<OnlyMethods<Entity>[T]>
    ) {
        const entities = Object
            .values(entitiesList) as any[];

        entities.forEach(entity => {
            entity[method](...args);
        });
    }
}
