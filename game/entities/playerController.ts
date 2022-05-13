import { KCodes, keyboardInput } from "../../core/input";
import { Character } from "./character";

export class PlayerController extends Character {
    public size = { x: 16, y: 32 };

    constructor(spriteName: string) {
        super(spriteName);
        keyboardInput.on('down:' + KCodes.K_UP, this.jump.bind(this));
    }

    public updateControls() {
        const leftPressed = keyboardInput
            .isPressed(KCodes.K_LEFT) ? 1 : 0;
        const rightPressed = keyboardInput
            .isPressed(KCodes.K_RIGHT) ? 1 : 0;

        const acc = rightPressed - leftPressed;

        this.move(acc);
    }

    public update() {
        super.update();
        this.updateControls();
    }
}
