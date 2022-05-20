import { EntityEvents } from "../../core/entity";
import { KCodes, keyboardInput } from "../../core/input";
import { InventoryService } from "../services/inventory.service";
import { state } from "../state";
import { Character } from "./character";
import { Interactor } from "./interactor";

export class PlayerController extends Character {
    public size = { x: 16, y: 32 };
    protected interactor = new Interactor();
    static currentPlayer: PlayerController;

    constructor(spriteName: string) {
        super(spriteName);

        this.addChild(this.interactor);
        this.once(EntityEvents.SPAWN, () => {
            state.state.player = this;
            InventoryService.player = this;
        })
    }

    public update() {
        super.update();
        this.updateControls();
    }

    private updateControls() {
        const leftPressed = keyboardInput
            .isPressed(KCodes.A) ? 1 : 0;
        const rightPressed = keyboardInput
            .isPressed(KCodes.D) ? 1 : 0;

        const acc = rightPressed - leftPressed;

        this.move(acc);

        keyboardInput.onTickPressed(KCodes.K_SPACE, this.jump.bind(this));
        keyboardInput.onTickPressed(KCodes.F, this.interact.bind(this));
    }

    private interact() {
        this.interactor.interact();
    }
}
