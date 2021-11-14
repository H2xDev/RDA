import Matter from "matter-js";
import { Entity, EntityEvents } from "./entity";
import { EventEmitter } from "./event";
import {compose} from "./utils/fp";
import { generateId } from "./utils/generateId";
import { V } from './utils/vectorUtil';

export enum SceneEvents {
    LOAD, DESTROY
}

export class Scene extends EventEmitter<SceneEvents> {
    private entities: { [k: string]: Entity } = {};
    protected runner: Matter.Runner = Matter.Runner.create();

    public engine: Matter.Engine = Matter.Engine.create();
    public world: Matter.World = this.engine.world;
    public render: Matter.Render = Matter.Render.create({
        engine: this.engine,
        options: {
            width: 800,
            height: 600,
        }
    });

    constructor() {
        super();

        this.start = this.start.bind(this);
        this.destroy = this.destroy.bind(this);
        this.preStart = this.preStart.bind(this);
        this.postDestroy = this.postDestroy.bind(this);

        const startHandler = compose(this.preStart, this.start);
        const destroyHandler = compose(this.destroy, this.postDestroy);

        this.on(SceneEvents.LOAD, startHandler)
        this.on(SceneEvents.DESTROY, destroyHandler);
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

    private preStart() {
        const { runner, engine, render } = this;
        Matter.Runner.start(runner, engine);
        Matter.Render.run(render);
        Matter.Render.lookAt(render, {
            min: V.Cr(0, 0),
            max: V.Cr(800, 480),
        })
    }

    public start() {};

    public destroy() {};

    private resetPhysics() {
        const { runner, world, engine, render } = this;
        Matter.World.clear(world, true);
        Matter.Runner.stop(runner);
        Matter.Engine.clear(engine);
        Matter.Render.stop(render);
    }

    public postDestroy() {
        this.entities = {};
        this.resetPhysics();
    }
}
