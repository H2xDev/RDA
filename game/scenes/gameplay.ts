import { Camera } from "../../core/camera";
import { Scene } from "../../core/scene";
import { context as c } from "../engine";

let frame = 0;

class _Gameplay extends Scene {
    private camera = new Camera(c);

    start() {
        this.addEntity(this.camera);
    }


    update() {
    }
}

export const Gameplay = new _Gameplay();
