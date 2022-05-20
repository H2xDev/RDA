import {Camera} from "./camera";
import { ChildrenList, Entity, EntityEvents } from "./entity";
import { EventEmitter } from "./event";
import { generateId } from "./utils/generateId";

export enum SceneEvents {
    LOAD,
    DESTROY,
}

export type WithCamera<Scene> = Scene & {
    camera: Camera,
    beforeCamera: () => void
};

export class Scene extends EventEmitter<SceneEvents> {
    public children: ChildrenList = {};
    public meta: { [k: string]: any } = {};

    constructor() {
        super();

        this.start = this.start.bind(this);
        this.destroy = this.destroy.bind(this);
        this.postDestroy = this.postDestroy.bind(this);

        this.on(SceneEvents.LOAD, this.start)
        this.on(SceneEvents.DESTROY, this.destroy);
    }

    public addEntity<T extends Entity>(entity: T, id: string = generateId()) {
        this.children[id] = entity;
        entity.id = id;
        entity.setScene(this);
        entity.trigger(EntityEvents.SPAWN);

        return entity;
    }

    public destroyEntity(en: Entity) {
        en.trigger(EntityEvents.DESTROY);
        delete this.children[en.id];
    }

    private updateObjects() {
        Entity.CallForAll(this.children, 'update');
    }

    public update() {
        this.updateObjects();
    }

    public postDestroy() {
        this.children = {};
    }

    public start() {};

    public destroy() {};
}
