import { EventEmitter } from "./event";

export interface RendererOptions {
    resolution: [number, number];
    pixelated: boolean;
    targetContainer: string;
    bgColor: string;
}

export enum RendererEvent {
    BEFORE_RENDER = 'beforeRender',
    AFTER_RENDER = 'afterRender',
}

type RenderFunction = () => void;

const defaultRendererOptions: RendererOptions = {
    resolution: [1280, 720],
    pixelated: true,
    targetContainer: 'body',
    bgColor: "#000",
}

let lastRender = Date.now();

export class Renderer extends EventEmitter<RendererEvent> {
    static DEFAULT_OPTIONS = defaultRendererOptions;

    public domElement = document.createElement('canvas');
    public context!: CanvasRenderingContext2D;
    public dt = 0.0016;
    public fps = 0;

    private options!: RendererOptions;

    constructor(options?: Partial<RendererOptions>) {
        super();

        this.setOptions(options || defaultRendererOptions);
    }

    public setOptions(newOptions: Partial<RendererOptions>) {
        this.options = {
            ...Renderer.DEFAULT_OPTIONS,
            ...newOptions,
        }

        this.applyOptions();
    }

    public render(func: RenderFunction, timestamp = performance.now()) {
        this.clear();
        requestAnimationFrame((t) => this.render(func, t));

        this.trigger(RendererEvent.BEFORE_RENDER);
        func();
        this.trigger(RendererEvent.AFTER_RENDER);
        this.updateDeltatime(timestamp);
    }

    public setBackgroundColor(color: string) {
        this.options.bgColor = color;
    }

    private clear() {
        const { context: c } = this;
        c.fillStyle = this.options.bgColor!;
        c.fillRect(0, 0, c.canvas.width, c.canvas.height);
    }

    private updateDeltatime(timestamp: number) {
        this.dt = (timestamp - lastRender) / 1000;
        this.fps = Math.round(1 / this.dt);
        lastRender = timestamp;
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
