import { EventEmitter } from "./event";
import { V } from "./utils/vector2";

export enum KCodes {
    K_UP = 38,
    K_DOWN = 40,
    K_LEFT = 37,
    K_RIGHT = 39,
    K_ENTER = 13,
    K_ESC = 27,
    K_SPACE = 32,

    A = 65, B = 66,
    C = 67, D = 68,
    E = 69, F = 70,
    G = 71, H = 72,
    I = 73, J = 74,
    K = 75, L = 76,
    M = 77, N = 78,
    O = 79, P = 80,
    Q = 81, R = 82,
    S = 83, T = 84,
    U = 85, V = 86,
    W = 87, X = 88,
    Y = 89, Z = 90,
}

export enum MouseInputEvent {
    LEFT_CLICK = 'leftClick',
    RIGHT_CLICK = 'rightClick',
};

export const mouseInput = new (
    class MInput extends EventEmitter<MouseInputEvent>{
        private relativeElement: HTMLElement = document.body;
        public position = V.zero();

        constructor() {
            super();
            window.addEventListener('mousemove', this.onMouseMove.bind(this));
            window.addEventListener('mousedown', this.onMouseClick.bind(this));
        }

        private onMouseMove(e: MouseEvent) {
            const { pageX, pageY } = e;
            const { left, top } = this.relativeElement.getBoundingClientRect();

            V.update(this.position).set({
                x: left - pageX,
                y: top - pageY,
            });
        }

        private onMouseClick(e: MouseEvent) {
            if (!e.button) {
                this.trigger(MouseInputEvent.LEFT_CLICK);
                return;
            }

            this.trigger(MouseInputEvent.RIGHT_CLICK);
        }

        public setRelativeElement(el: HTMLElement) {
            this.relativeElement = el;
        }
    }
)

export const keyboardInput = new (
    class KInput extends EventEmitter {
        private state: number[] = [];
        private tickState: number[] = [];
    
        constructor() {
            super();
            this.initializeListeners();
        }
    
        private initializeListeners() {
            const handleKeydown = (e: KeyboardEvent) => {
                if (this.state[e.keyCode] !== 1) {
                    this.trigger('down:' + e.keyCode);
                }
    
                this.state[e.keyCode] = 1;
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
    
            return this.state[code] === 1;
        }
    
        public onTickPressed(code: number | string, callback: () => void) {
            if (typeof code === 'string') {
                code = code.charCodeAt(0);
            }
    
            if (this.isPressed(code)) {
                if (this.tickState[code] === 0) {
                    this.tickState[code] = 1;
                    callback();
                }
            } else {
                this.tickState[code] = 0;
            }
        }
    }
);

