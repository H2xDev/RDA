import { Resource } from "./resourceManager";
interface SpriteOptions {
    frameSize: [number, number];
    offset?: [number, number];
    scale: [number, number];
    speed?: number;
}
interface SpriteState {
    frame: number;
    offset: [number, number];
    scale: [1, 1];
    rotation: number;
}
export default class Sprite extends Resource {
    private filename;
    private image;
    private options;
    state: SpriteState;
    constructor(filename: string, options: SpriteOptions);
    private setOptions;
    private loadImage;
    private get frameState();
    private applyTransform;
    render(x: number, y: number): void;
    clone(): Sprite;
}
export {};
