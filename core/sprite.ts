import { EventEmitter } from "./event";


interface SpriteOptions {
    filename: string;
    frame: [number, number];
    speed: number;
}

interface SpriteState {
    frame: 0,
    scale: [1, 1],
    rotate: 0,
}

export default class Sprite extends EventEmitter {
    private image = new Image();
    private options!: SpriteOptions;
    public state!: SpriteState;

    constructor(options: SpriteOptions) {
        super();
    }

    private setOptions(options: SpriteOptions) {
        this.options = {
            ...this.options,
            ...options,
        }

        this.applyOptions();
    }

    private applyOptions() {

    }

    private loadImage() {
        
    }

    render(x: number, y: number) {

    }

    clone() {
        return new Sprite(this.options);
    }
}