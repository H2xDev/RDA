import { EventEmitter } from "./event";

type RendererEventList = 'beforeRender' | 'afterRender';

interface RendererOptions {
    resolution: [number, number];
    pixelated: boolean;
    targetContainer: string;
}

type RenderFunction = () => void;

const DEFAULT_OPTIONS: RendererOptions = {
    resolution: [800, 480],
    pixelated: true,
    targetContainer: 'body',
}

export class Renderer extends EventEmitter<RendererEventList> {
    static DEFAULT_OPTIONS = DEFAULT_OPTIONS;

    public domElement = document.createElement('canvas');
    public context!: CanvasRenderingContext2D;

    private options!: RendererOptions;

    constructor(options?: RendererOptions) {
        super();

        this.setOptions(options || {});
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

        this.trigger('beforeRender');
        func();
        this.trigger('afterRender');
    }

    public clear() {
        const { context: c } = this;

        c.fillStyle = "#000";
        c.fillRect(0, 0, c.canvas.width, c.canvas.height);
    }

    private applyOptions() {
        const [ width, height ] = this.options.resolution;
        const { pixelated, targetContainer } = this.options;

        this.domElement.width = width;
        this.domElement.height = height;
        this.context = this.domElement
            .getContext('2d', { alpha: false })!;
        
        this.context.imageSmoothingEnabled = !pixelated;
        this.domElement.style.imageRendering = pixelated ? 'pixelated' : '';

        document
            .querySelector(targetContainer)!
            .appendChild(this.domElement);
    }
}