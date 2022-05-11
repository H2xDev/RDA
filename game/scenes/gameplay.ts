import { Camera } from "../../core/camera";
import { EntityEvents } from "../../core/entity";
import { DefaultResourceManager } from "../../core/resourceManager";
import { Scene } from "../../core/scene";
import { Level } from "../../core/tiled/level";
import { ResourceEvents } from "../../core/types/fileManagerEvents.enum";
import {V} from "../../core/utils/vector2";
import { context as c } from "../engine";
import {Player} from "../entities/player";

import testmap from '../maps/map1.json';

class _Gameplay extends Scene {
    private camera = new Camera(c);

    constructor() {
        super();
        Level.camera = this.camera;
        Level.instance
            .load(testmap as TiledMapOrthogonal);
        Level.instance
            .on(ResourceEvents.LOADED, () => {
                const c = new Player();
                V.update(c.position).set({ x: 260, y: 160});
                this.camera.entityToFollow = c;
                this.addEntity(c);
            });
    }

    start() {
        this.camera.setScene(this);
        this.camera.trigger(EntityEvents.SPAWN);
    }

    update() {
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
}

export const Gameplay = new _Gameplay();
