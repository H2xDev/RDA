import { Scene } from "./scene";
export declare class SceneController {
    private currentScene;
    constructor();
    update(): void;
    load(scene: Scene): void;
    private destroyScene;
    private setScene;
}
