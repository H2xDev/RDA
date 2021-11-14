import { EventEmitter } from "./event";
declare type RendererEventList = 'beforeRender' | 'afterRender';
interface RendererOptions {
    resolution: [number, number];
    pixelated: boolean;
    targetContainer: string;
}
declare type RenderFunction = () => void;
export declare class Renderer extends EventEmitter<RendererEventList> {
    static DEFAULT_OPTIONS: RendererOptions;
    domElement: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    private options;
    constructor(options?: Partial<RendererOptions>);
    setOptions(newOptions: Partial<RendererOptions>): void;
    render(func: RenderFunction): void;
    clear(): void;
    private applyOptions;
}
export {};
