import { Graphics } from "./graphics";
import { Resource } from "./resourceManager";
import { ResourceEvents } from "./types/fileManagerEvents.enum";

const { round, PI } = Math;

interface SpriteOptions {
    frameSize: [number, number];
    offset?: [number, number];
    scale?: [number, number];
    speed?: number;
    maxFrames?: number;
}

interface SpriteStateFiles {
    [state: string]: string;
}

const DEFAULT_SPRITE_OPTIONS: Partial<SpriteOptions> = {
    speed: 1,
    offset: [0, 0],
}

export default class Sprite extends Resource {
    private image = new Image();
    public options!: SpriteOptions;
    
    public speed = 1;
    public frame = 0;
    public scale: [number, number] = [1, 1];
    public angle = 0;
    public offset: [number, number] = [0, 0];
    public frameSize: [number, number] = [1, 1];
    public maxFrames = 0;
    public transform!: DOMMatrix;

    constructor(
        private filename: string,
        options: SpriteOptions,
    ) {
        super();
        this.setOptions(options);
    }

    private setOptions(options: SpriteOptions) {
        const updatedOptions = {
            ...DEFAULT_SPRITE_OPTIONS,
            ...options,
        };

        this.speed = updatedOptions.speed || this.speed;
        this.frameSize = updatedOptions.frameSize || this.frameSize;
        this.scale = updatedOptions.scale || this.scale;
        this.offset = updatedOptions.offset || this.offset;
        this.maxFrames = updatedOptions.maxFrames || 0;

        this.loadImage();
    }

    private loadImage() {
        const { frameSize, image, maxFrames } = this;

        const onImageLoaded = () => {
            const [ fw, fh ] = frameSize;
            const { width, height } = image;

            this.maxFrames = maxFrames || ((width / fw) * (height / fh)); 
            this.trigger(Resource.Events.LOADED, this);
        }

        this.image.src = `/sprites/${this.filename}`    
        this.image.addEventListener('load', onImageLoaded)
    }
    
    private get frameState(): [number, number, number, number] {
        if (!this.isLoaded) return [0, 0, 0, 0];

        let { frame } = this;
        frame = round(frame);

        const { width, height } = this.image;
        const [fw, fh] = this.frameSize;
        const mx = ((width / fw) >> 0);
        const my = ((height / fh) >> 0);

        const ix = frame % mx;
        const iy = (frame / mx) % my >> 0;

        const fx = round(fw * ix);
        const fy = round(fh * iy);

        return [fx, fy, fw, fh];
    }

    public useTransform(x: number, y: number, draw: (c: CanvasRenderingContext2D) => void) {
        const { angle, scale, offset } = this;
        const [ ox, oy ] = offset;
        const [ sx, sy ] = scale;
        const { Context: c } = Graphics;

        c.save();
        c.translate(x, y);
        c.rotate(angle / 180 * PI);
        c.scale(sx, sy);
        c.translate(- ox, - oy);
        draw(c);
        c.restore();
    }

    public render(x: number, y: number) {
        if (!this.isLoaded) return;

        const { image, frameState, speed, frameSize } = this;
        const [ fw, fh ] = frameSize;

        this.useTransform(x, y, (c) => {
            c.drawImage(image, ...frameState, 0, 0, fw, fh);
        });

        this.frame += speed;
    }

    public clone() {
        const { offset, scale, speed } = this;
        const { frameSize, maxFrames } = this;
        const { filename } = this;

        return new Sprite(filename, {
            offset, scale, speed,
            frameSize, maxFrames,
        });
    }
}

type StateConditionMap<T extends SpriteStateFiles> = {
    [S in keyof T]?: ((state: S) => boolean)[];
}

export class SpriteGroup<T extends SpriteStateFiles> extends Resource {
    private list: { [state: string]: Sprite } = {};
    private conditions: StateConditionMap<T> = {};
    public state = 'default';
    public angle = 0;
    public scale: [number, number] = [1, 1];
    public speed = 1;

    constructor(
        private states: T,
        private options: SpriteOptions
    ) {
        super();
        this.defineList();
        this.updateOptions();
    }

    private updateOptions() {
        this.speed = this.options.speed || this.speed;
        this.scale = this.options.scale || this.scale;
    }

    private defineList() {
        const { options, states } = this;

        let totalSprites = Object.values(states).length;

        const onSpriteLoaded = () => {
            totalSprites -= 1;

            if (!totalSprites) {
                this.trigger(ResourceEvents.LOADED, this);
            }
        }

        const listEntries = Object
            .entries(states)
            .map(([state, file]) => {
                const sprite = new Sprite(file, options);

                sprite.once(ResourceEvents.LOADED, onSpriteLoaded);

                return [state, sprite];
            });

        this.list = Object.fromEntries(listEntries);
    }

    private updateState() {
        Object
            .entries(this.conditions)
            .find(([state, conditions]) => {
                if (!conditions) return false;

                const isPassed = conditions.some((func: any) => func(state));

                if (isPassed) {
                    this.state = state;
                    return true;
                }
            })
    }

    public get currentSprite() {
        return this.list[this.state];
    }

    public render(x: number, y: number) {
        if (!this.currentSprite) return;

        this.updateState();

        this.currentSprite.angle = this.angle;
        this.currentSprite.scale = this.scale;
        this.currentSprite.speed = this.speed;
        this.currentSprite.render(x, y);
    }

    public condition<K extends keyof T>(state: K, conditionFunciton: (state: K) => boolean) {
        this.conditions[state] = this.conditions[state] || [];
        this.conditions[state]!.push(conditionFunciton);
    }
}
