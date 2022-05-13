import { PlayerController } from "./playerController";

export class Player extends PlayerController {
    protected movementSpeed = 15;

    constructor() {
        super('player');
        this.setDebug(true);
    }
}
