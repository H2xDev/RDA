import { Camera } from "../../core/camera";
import { EntityEvents } from "../../core/entity";
import { Scene } from "../../core/scene";
import { context } from "../engine";

export abstract class SceneWithCamera extends Scene {
    public camera = new Camera(context);

    public start() {
        this.camera.setScene(this);
        this.camera.trigger(EntityEvents.SPAWN);
    }
}
