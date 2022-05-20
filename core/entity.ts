import { EventEmitter } from "./event";
import { Scene } from "./scene";
import { generateId } from "./utils/generateId";

export enum EntityEvents {
    SPAWN,
    DESTROY
}

export interface ChildrenList {
    [id: string]: Entity;
}

export type OnlyMethods<T> = Pick<T, {
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T]>;

export class Entity<E extends (string | number) = number> extends EventEmitter<EntityEvents | E> {
    public scene!: Scene;
    public id!: string;
    public position = { x: 0, y: 0 };
    public children: ChildrenList = {};
    public parent!: Entity;

    protected isDebugging = false;
    protected debugColor = "#0f0";

    public update() {
        Entity.CallForAll(this.children, 'update');
    }

    public setScene<T extends Scene>(scene: T) {
        this.scene = scene;
    }

    public setDebug(state: boolean) {
        this.isDebugging = state;
    }

    public addChild(e: Entity) {
        const id = generateId();
        this.children[id] = e;
        e.id = id;
        e.parent = this as Entity;
    }

    public destroy() {
        this.scene.destroyEntity(this as Entity);
    }

    public removeEntity(e: Entity) {
        delete this.children[e.id];
    }

    static CallForAll<T extends keyof OnlyMethods<Entity>>(
        entitiesList: ChildrenList,
        method: T,
        ...args: Parameters<OnlyMethods<Entity>[T]>
    ) {
        const entities = Object
            .values(entitiesList) as any[];

        entities.forEach(entity => {
            entity[method]?.(...args);
        });
    }
}
