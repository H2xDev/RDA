import {Graphics} from "../core/graphics";
import { Renderer } from "../core/renderer";
import { Scene } from "../core/scene";
import { SceneController } from "../core/sceneController";
import { Level } from "../core/tiled/level";
import { ContextHelper } from "../core/utils/contextHelpers";

export const sceneController = new SceneController();
export const renderer = new Renderer({
    pixelated: true,
    resolution: [1280 / 2, 720 / 2],
});
export const { context } = renderer;

Level.context = context;
ContextHelper.context = context;
Graphics.Context = context;

export function startEngine(scene: Scene) {
    sceneController.load(scene);
    renderer.render(sceneController.update);
}
