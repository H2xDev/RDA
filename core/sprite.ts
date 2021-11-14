import { EventEmitter } from "./event";
import {Graphics} from "./graphics";
import {Resource} from "./resourceManager";
import {ResourceEvents} from "./types/fileManagerEvents.enum";

const { round, PI } = Math;

interface SpriteOptions {
    frameSize: [number, number];
    offset?: [number, number];
    scale: [number, number];
    speed?: number;
}

interface SpriteState {
    frame: number,
    offset: [number, number],
    scale: [1, 1],
    rotation: number,
}

const DEFAULT_SPRITE_OPTIONS: Partial<SpriteOptions> = {
    speed: 1,
    offset: [0, 0],
}

export default class Sprite extends Resource {
    private image = new Image();
    private options!: SpriteOptions;

    public state: SpriteState = {
        frame: 0,
        offset: [0, 0],
        scale: [1, 1],
        rotation: 0,
    };

    constructor(
        private filename: string,
        options: SpriteOptions,
    ) {
        super();
        this.setOptions(options);
    }

    private setOptions(options: SpriteOptions) {
        this.options = {
            ...DEFAULT_SPRITE_OPTIONS,
            ...this.options,
            ...options,
        }

        this.loadImage();
    }

    private loadImage() {
        const onImageLoaded = () => {
            this.trigger(Resource.Events.LOADED, this);
        }
        this.image.src = `/sprites/${this.filename}`    
        this.image.addEventListener('load', onImageLoaded)
    }
    
    private get frameState(): [number, number, number, number] {
        if (!this.isLoaded) return [0, 0, 0, 0];

        let { frame } = this.state;
        frame = round(frame);

        const { width, height } = this.image;
        const [fw, fh] = this.options.frameSize;
        const mx = ((width / fw) >> 0);
        const my = ((height / fh) >> 0);

        const ix = frame % mx;
        const iy = (frame / mx) % my >> 0;

        const fx = round(fw * ix);
        const fy = round(fh * iy);

        return [fx, fy, fw, fh];
    }

    private applyTransform(x: number, y: number) {
        const { rotation, scale, offset } = this.state;
        const [ ox, oy ] = offset;
        const [ sx, sy ] = scale;
        const { Context: c } = Graphics;

        c.rotate(rotation / 180 * PI);
        c.scale(sx, sy);
        c.translate(x - ox, y - oy);
    }

    render(x: number, y: number) {
        if (!this.isLoaded) return;

        const { image, state, options, frameState } = this;
        const { speed = 1 } = options;
        const { Context: c } = Graphics;
        const [fw, fh] = options.frameSize;

        c.save();
        this.applyTransform(x, y);
        c.drawImage(
            image, ...frameState,
            0, 0, fw, fh,
        );
        c.restore();

        state.frame += speed;
    }

    public clone() {
        return new Sprite(this.filename, this.options);
    }
}
