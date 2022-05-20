import { EventEmitter } from "./event";
import { Scene, SceneEvents } from "./scene";

export enum SceneControllerEvent {
    SCENE_CHANGED = 'sceneChanged',
}

export class SceneController extends EventEmitter<SceneControllerEvent> {
    public currentScene!: Scene;

    constructor() {
        super();
        this.update = this.update.bind(this);
    }

    public update() {
        if (this.currentScene) {
            this.currentScene.update();
        }
    }

    public load(scene: Scene) {
        this.destroyScene();
        this.setScene(scene);
        this.currentScene.trigger(SceneEvents.LOAD);
        this.trigger(SceneControllerEvent.SCENE_CHANGED, scene);
    }

    private destroyScene() {
        if (!this.currentScene) return;
        this.currentScene.trigger(SceneEvents.DESTROY);
    }

    private setScene(scene: Scene) {
        this.currentScene = scene;
    }
}
