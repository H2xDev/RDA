import { EventEmitter } from "./event";

export enum KCodes {
    K_UP = 38, K_DOWN = 40,
    K_LEFT = 37, K_RIGHT = 39,
    K_ENTER = 13,
}

class KInput extends EventEmitter {
    private state: number[] = [];

    constructor() {
        super();
        this.initializeListeners();
    }

    private initializeListeners() {
        const handleKeydown = (e: KeyboardEvent) => {
            this.state[e.keyCode] = 1;

            this.trigger('down:' + e.keyCode);
        }

        const handleKeyup = (e: KeyboardEvent) => {
            this.state[e.keyCode] = 0;
            
            this.trigger('up:' + e.keyCode);
        }

        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('keyup', handleKeyup);
    }

    public isPressed(code: number | string) {
        if (typeof code === 'string') {
            code = code.charCodeAt(0);
        }
    }
}

export const keyboardInput = new KInput();