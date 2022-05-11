import { EventEmitter } from "./event";

type RendererEventList = 'beforeRender' | 'afterRender';

interface RendererOptions {
    resolution: [number, number];
    pixelated: boolean;
    targetContainer: string;
    bgColor: string;
}

type RenderFunction = () => void;

const DEFAULT_OPTIONS: RendererOptions = {
    resolution: [1280, 720],
    pixelated: true,
    targetContainer: 'body',
    bgColor: "#000",
}

export class Renderer extends EventEmitter<RendererEventList> {
    static DEFAULT_OPTIONS = DEFAULT_OPTIONS;

    public domElement = document.createElement('canvas');
    public context!: CanvasRenderingContext2D;
    public deltaTime = 0.0016;

    private options!: RendererOptions;

    constructor(options?: Partial<RendererOptions>) {
        super();

        this.setOptions(options || DEFAULT_OPTIONS );
    }

    public setOptions(newOptions: Partial<RendererOptions>) {
        this.options = {
            ...Renderer.DEFAULT_OPTIONS,
            ...newOptions,
        }

        this.applyOptions();
    }

    public render(func: RenderFunction) {
        this.clear();
        requestAnimationFrame(() => this.render(func));

        const p = performance.now();
        this.trigger('beforeRender');
        func();
        this.trigger('afterRender');
        this.deltaTime = (performance.now() - p) / 1000;
    }

    public setBackgroundColor(color: string) {
        this.options.bgColor = color;
    }

    public clear() {
        const { context: c } = this;

        c.fillStyle = this.options.bgColor!;
        c.fillRect(0, 0, c.canvas.width, c.canvas.height);
    }

    private applyOptions() {
        const [ width, height ] = this.options.resolution;
        const { pixelated, targetContainer } = this.options;
        const { domElement } = this;

        domElement.width = width;
        domElement.height = height;
        domElement.style.imageRendering = pixelated ? 'pixelated' : '';

        this.context = domElement
            .getContext('2d', { alpha: false })!;
        
        this.context.imageSmoothingEnabled = !pixelated;

        document
            .querySelector(targetContainer)!
            .appendChild(domElement);
    }
}
