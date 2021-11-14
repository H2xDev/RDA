import { Bodies, Composite } from "matter-js";
import { Camera } from "../../core/camera";
import { DEFAULT_RESOURCE_MANAGER } from "../../core/resourceManager";
import { Scene } from "../../core/scene";
import { context as c } from "../engine";
import {Player} from "../entities/player";

class _Gameplay extends Scene {
    private camera = new Camera(c);

    private player = new Player();

    start() {
        this.addEntity(this.player);
        Composite.add(
            this.world,
            Bodies.rectangle(400, 400, 800, 40, { isStatic: true }),
        );

        this.camera.position.x += 400;
        this.camera.position.y += 240;
    }


    update() {
        if (DEFAULT_RESOURCE_MANAGER.isLoading) {
            c.fillStyle = "#fff";
            c.textBaseline = "middle";
            c.textAlign = "center";
            c.fillText("Loading...", 0, 0);
            return;
        }

        this.camera.update();

        super.update();

        c.save();
        c.globalCompositeOperation = "screen";
        c.drawImage(this.render.canvas, 0, 0);
        c.restore();
    }
}

export const Gameplay = new _Gameplay();
