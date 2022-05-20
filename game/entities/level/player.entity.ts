import { EntityEvents } from "../../../core/entity";
import { Scene, WithCamera } from "../../../core/scene";
import { PlayerController } from "../playerController";

export class Player extends PlayerController {
    public movementSpeed = 150;
    static current: Player;

    constructor() {
        super('player');

        if (Player.current) {
            return Player.current;
        }

        this.on(EntityEvents.SPAWN, () => {
            const s = this.scene as WithCamera<Scene>;
            s.camera.entityToFollow = this;
            s.camera.resetPosition();
        })

        this.on(EntityEvents.DESTROY, () => {
            const s = this.scene as WithCamera<Scene>;
            s.camera.entityToFollow = undefined;
        })

        Player.current = this;
    }
}
