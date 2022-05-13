import { EventEmitter } from "./event";

export interface RendererOptions {
    resolution: [number, number];
    pixelated: boolean;
    targetContainer: string;
    bgColor: string;
    fps: number;
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
    fps: 60,
}

let lastRender = performance.now();
let deltaTimes: number[] = [];
let averageDt = 0.016;

export class Renderer extends EventEmitter<RendererEvent> {
    static DEFAULT_OPTIONS = defaultRendererOptions;

    public domElement = document.createElement('canvas');
    public context!: CanvasRenderingContext2D;
    public dt = 0.0016;

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

    public render(func: RenderFunction) {
        this.clear();
        requestAnimationFrame(this.render.bind(this, func));

        this.updateDeltatime();
        this.trigger(RendererEvent.BEFORE_RENDER);
        func();
        this.trigger(RendererEvent.AFTER_RENDER);
    }

    public setBackgroundColor(color: string) {
        this.options.bgColor = color;
    }

    private clear() {
        const { context: c } = this;
        c.fillStyle = this.options.bgColor!;
        c.fillRect(0, 0, c.canvas.width, c.canvas.height);
    }

    private updateDeltatime() {
        const now = performance.now();
        this.dt = (now - lastRender) / 1000;
        lastRender = now;

        if (!averageDt) {
            if (deltaTimes.length < 5) {
                deltaTimes.push(this.dt);
            } else {
                averageDt = deltaTimes.reduce((c, p) => c + p, 0) / 5;
            }
        }

        this.dt = Math.min(this.dt, averageDt);
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
