import { KCodes, keyboardInput } from "../../core/input";
import { Character } from "./character";

export class Player extends Character {
    protected movementSpeed = .5;
    public size = { x: 16, y: 32 };

    constructor() {
        super('player');

        keyboardInput.on('down:' + KCodes.K_UP, this.jump.bind(this));
    }

    public updateControls() {
        const leftPressed = keyboardInput
            .isPressed(KCodes.K_LEFT) ? 1 : 0;
        const rightPressed = keyboardInput
            .isPressed(KCodes.K_RIGHT) ? 1 : 0;

        const xAcc = rightPressed - leftPressed;

        this.move(xAcc);
    }

    public update() {
        super.update();
        this.updateControls();
    }
}
