import { Graphics } from "../core/graphics";
import { Renderer } from "../core/renderer";
import { Scene } from "../core/scene";
import { SceneController } from "../core/sceneController";
import polyDecomp from 'poly-decomp';
import Matter from 'matter-js';

export const sceneController = new SceneController();
export const renderer = new Renderer({
    pixelated: false,
});
export const { context } = renderer;

Graphics.Context = context;
Matter.Common.setDecomp(polyDecomp);

export function startEngine(scene: Scene) {
    sceneController.load(scene);
    renderer.render(sceneController.update);
}
