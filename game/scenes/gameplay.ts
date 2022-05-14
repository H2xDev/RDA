import { Camera } from "../../core/camera";
import { Entity, EntityEvents } from "../../core/entity";
import { DefaultResourceManager } from "../../core/resourceManager";
import { Scene } from "../../core/scene";
import { Level } from "../../core/tiled/level";
import { ResourceEvents } from "../../core/types/fileManagerEvents.enum";
import { V } from "../../core/utils/vector2";
import {enitityTemplates, resolveTemplate} from "../editor/templates";
import { context as c, context, renderer } from "../engine";
import { levelEntities } from "../entities/level";

import testmap from '../maps/map1.json';

const { instance: LevelManager } = Level;

class _Gameplay extends Scene {
    private camera = new Camera(c);

    constructor() {
        super();
        Level.camera = this.camera;
        LevelManager
            .load(testmap as TiledMapOrthogonal);
        LevelManager
            .on(ResourceEvents.LOADED, this.spawnEntities.bind(this));
    }

    public start() {
        this.camera.setScene(this);
        this.camera.trigger(EntityEvents.SPAWN);
    }

    public beforeCamera() {
        context.fillStyle = "#fff";
        context.fillText(String(renderer.fps), 16, 16);
        context.fillText(String(renderer.dt), 16, 32);
    }

    public update() {
        if (DefaultResourceManager.isLoading) {
            c.fillStyle = "#fff";
            c.textBaseline = "middle";
            c.textAlign = "center";
            c.fillText("Loading...", 0, 0);
            return;
        }

        Level.instance.render(() => {
            super.update();
        });
    } 
    
    private spawnEntities() {
        const bySupport = (o: TiledObject) => {
            console.log(o);
            return (o.type in levelEntities) || !!resolveTemplate(o);
        }

        const toEntities = (o: TiledObject) => {
            if (o.template) {
                const t = resolveTemplate(o)!;

                o.type = t.object.type;
                
                if (t.object.gid) {
                    o.y -= t.object.height;
                    const h = V.div({ x: t.object.width, y: t.object.height }, 2);

                    V.update(o).add(h);
                }
            }

            const e = new levelEntities[o.type]();

            V.update(e.position).set(o);
            this.addEntity(e, String(o.id));
            return e;
        }

        const triggerEvents = (e: Entity) => {
            e.setScene(this);
            e.trigger(EntityEvents.SPAWN, e);
        }

        LevelManager.objects
            .filter(bySupport)
            .map(toEntities)
            .forEach(triggerEvents);
    }
}

export const Gameplay = new _Gameplay();
