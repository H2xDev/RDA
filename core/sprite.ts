import {Graphics} from "./graphics";
import {Resource} from "./resourceManager";

const { round, PI } = Math;

interface SpriteOptions {
    frameSize: [number, number];
    offset?: [number, number];
    scale?: [number, number];
    speed?: number;
    maxFrames?: number;
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
        const onImageLoaded = () => {
            const [fw, fh] = this.frameSize;
            const { width, height } = this.image;
            this.maxFrames = this.maxFrames || ((width / fw) * (height / fh)); 
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

    public useTransform(x: number, y: number) {
        const { angle, scale, offset } = this;
        const [ ox, oy ] = offset;
        const [ sx, sy ] = scale;
        const { Context: c } = Graphics;

        c.translate(x, y);
        c.rotate(angle / 180 * PI);
        c.scale(sx, sy);
        c.translate(- ox, - oy);
        this.transform = c.getTransform();
    }

    public render(x: number, y: number) {
        if (!this.isLoaded) return;

        const { image, frameState, speed, frameSize } = this;
        const { Context: c } = Graphics;
        const [ fw, fh ] = frameSize;

        c.save();
        this.useTransform(x, y);
        c.drawImage(
            image, ...frameState,
            0, 0, fw, fh,
        );
        c.restore();

        this.frame += speed;
    }

    public get frameDrawingArgs() {
        const { image, frameState, frameSize } = this;
        const [ fw, fh ] = frameSize;

        return [image, ...frameState, 0, 0, fw, fh];
    }

    public clone() {
        return new Sprite(this.filename, {
            offset: this.offset,
            scale: this.scale,
            speed: this.speed,
            frameSize: this.frameSize,
            maxFrames: this.maxFrames,
        });
    }
}
