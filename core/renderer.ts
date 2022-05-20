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
    PAUSE_STATE_CHANGED = 'pauseStateChanged',
}

type RenderFunction = () => void;

const defaultRendererOptions: RendererOptions = {
    resolution: [1280, 720],
    pixelated: true,
    targetContainer: 'body',
    bgColor: "#000",
}

let lastRender = performance.now();

export class Renderer extends EventEmitter<RendererEvent> {
    static DEFAULT_OPTIONS = defaultRendererOptions;

    public domElement = document.createElement('canvas');
    public context!: CanvasRenderingContext2D;
    public dt = 0.016;
    public fps = 0;
    public speedMultipiler = 1;
    public isPaused = false;
    private tempCanvas = document.createElement('canvas');

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
        requestAnimationFrame((t) => this.render(func, t));

        this.updateDeltatime(timestamp);
        this.clear();

        if (!this.isPaused) {
            func();
        } else {
            this.renderPauseView();
        }
    }

    public setBackgroundColor(color: string) {
        this.options.bgColor = color;
    }

    public setPause(state: boolean) {
        const c = this.tempCanvas.getContext('2d')!;
        c.drawImage(this.domElement, 0, 0);

        this.isPaused = state;

        this.trigger(RendererEvent.PAUSE_STATE_CHANGED, state);
    }

    private renderPauseView() {
        const { context: c, tempCanvas } = this;

        c.drawImage(tempCanvas, 0, 0);
    }

    private clear() {
        const { context: c } = this;
        c.fillStyle = this.options.bgColor!;
        c.fillRect(0, 0, c.canvas.width, c.canvas.height);
    }

    private updateDeltatime(timestamp: number) {
        this.dt = (timestamp - lastRender) / 1000;
        this.fps = 1 / this.dt;
        this.dt = Math.min(0.018, this.dt);

        this.dt *= 10;

        if (this.isPaused) {
            this.dt = 0;
        }

        lastRender = timestamp;
    }

    private applyOptions() {
        const [ width, height ] = this.options.resolution;
        const { pixelated, targetContainer } = this.options;
        const { domElement, tempCanvas } = this;

        domElement.width = width;
        domElement.height = height;
        domElement.style.imageRendering = pixelated ? 'pixelated' : '';
        tempCanvas.width = width;
        tempCanvas.height = height;

        this.context = domElement
            .getContext('2d', { alpha: false })!;
        this.context.imageSmoothingEnabled = !pixelated;

        document.documentElement.style
            .setProperty('--resolution-x', width + 'px');
        document.documentElement.style
            .setProperty('--resolution-y', height + 'px');
        document
            .querySelector(targetContainer)!
            .appendChild(domElement);
    }
}
