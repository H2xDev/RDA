import { EventEmitter } from "./event";
export declare enum KCodes {
    K_UP = 38,
    K_DOWN = 40,
    K_LEFT = 37,
    K_RIGHT = 39,
    K_ENTER = 13
}
declare class KInput extends EventEmitter {
    private state;
    constructor();
    private initializeListeners;
    isPressed(code: number | string): boolean;
}
export declare const keyboardInput: KInput;
export {};
