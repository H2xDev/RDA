import { Graphics } from "../core/graphics";
import { mouseInput } from "../core/input";
import { Renderer } from "../core/renderer";
import { Scene } from "../core/scene";
import { SceneController } from "../core/sceneController";
import { Level } from "../core/tiled/level";
import { ContextHelper } from "../core/utils/contextHelpers";

export const sceneController = new SceneController();
export const renderer = new Renderer({
    pixelated: true,
    resolution: [1280 / 3, 720 / 3],
});
export const { context } = renderer;

Level.context = context;
ContextHelper.context = context;
Graphics.Context = context;
mouseInput.setRelativeElement(context.canvas);

export function startEngine(scene: Scene) {
    sceneController.load(scene);
    renderer.render(sceneController.update);
}
