import { Scene, SceneEvents } from "./scene";

export class SceneController {
    private currentScene!: Scene;

    constructor() {
        this.update = this.update.bind(this);
    }

    update() {
        if (this.currentScene) {
            this.currentScene.update();
        }
    }

    load(scene: Scene) {
        this.destroyScene();
        this.setScene(scene);
        this.currentScene.trigger(SceneEvents.LOAD);
    }

    private destroyScene() {
        if (!this.currentScene) return;
        this.currentScene.trigger(SceneEvents.DESTROY);
    }

    private setScene(scene: Scene) {
        this.currentScene = scene;
    }
}