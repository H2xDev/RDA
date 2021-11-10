import { Entity, EntityEvents } from "./entity";
import { EventEmitter } from "./event";
import { generateId } from "./utils/generateId";

export enum SceneEvents {
    LOAD, DESTROY
}

export class Scene extends EventEmitter<SceneEvents> {
    private entities: { [k: string]: Entity } = {};

    constructor() {
        super();

        this.on(SceneEvents.LOAD, () => this.start())
        this.on(SceneEvents.DESTROY, () => this.destroy());
    }

    public addEntity<T extends Entity>(entity: T, id: string = generateId()) {
        this.entities[id] = entity;
        entity.setScene(this);
        entity.trigger(EntityEvents.SPAWN);

        return entity;
    }

    private updateObjects() {
        const update = (entity: Entity) => entity.update?.();

        Object
            .values(this.entities)
            .forEach(update);
    }

    public update() {
        this.updateObjects();
    }

    public start() {}

    public destroy() {
        this.entities = {};
    }
}