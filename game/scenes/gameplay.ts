import { Bodies, Composite } from "matter-js";
import { Camera } from "../../core/camera";
import {EntityEvents} from "../../core/entity";
import { DEFAULT_RESOURCE_MANAGER } from "../../core/resourceManager";
import { Scene } from "../../core/scene";
import { context as c } from "../engine";
import { Player } from "../entities/player";
import {MapManager} from "../mapLoader";

class _Gameplay extends Scene {
    private camera = new Camera(c);
    private player = new Player();
    private mapLoader = new MapManager();

    start() {
        this.addEntity(this.player);
        this.mapLoader
            .setScene(this);
        this.mapLoader
            .setCamera(this.camera);
        this.mapLoader
            .loadMap('untitled');
       
        this.camera.entityToFollow = this.player.body;
        this.camera.setScene(this);
        this.camera.trigger(EntityEvents.SPAWN);
    }

    beforeCamera() { 
    }

    update() {
        if (DEFAULT_RESOURCE_MANAGER.isLoading) {
            c.fillStyle = "#fff";
            c.textBaseline = "middle";
            c.textAlign = "center";
            c.fillText("Loading...", 0, 0);
            return;
        }
        this.mapLoader.renderImageLayers();

        
        super.update();
    } 
}

export const Gameplay = new _Gameplay();
