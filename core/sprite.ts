import { EventEmitter } from "./event";
import {Resource} from "./resourceManager";
import {ResourceEvents} from "./types/fileManagerEvents.enum";


interface SpriteOptions {
    filename: string;
    frame: [number, number];
    speed: number;
}

interface SpriteState {
    frame: number,
    scale: [number, number],
    rotate: number,
}

export default class Sprite extends Resource {
    private image = new Image();
    private options!: SpriteOptions;
    public state: SpriteState = {
        frame: 0,
        scale: [1, 1],
        rotate: 0,
    };

    constructor(
        private filename: string,
        options: SpriteOptions
    ) {
        super();
    }

    private setOptions(options: SpriteOptions) {
        this.options = {
            ...this.options,
            ...options,
        }

        this.loadImage();
    }

    private loadImage() {
        const onImageLoaded = () => {
            this.trigger(ResourceEvents.LOADED, this);
        }
        this.image.src = `/sprite/${this.filename}`    
        this.image.addEventListener('load', onImageLoaded)
    }

    render(x: number, y: number) {

    }

    clone() {
        return new Sprite(this.options);
    }
}
