import { Body } from "./body";

export enum InteractEvent {
    INTERACT = 'interact',
}

export class Interactable extends Body<InteractEvent> {
    constructor() {
        super();
        this.on<Body>(InteractEvent.INTERACT, this.onInteract.bind(this))
    }

    protected onInteract(_by?: Body) {}
}
