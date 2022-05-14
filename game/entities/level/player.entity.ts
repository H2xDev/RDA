import { EntityEvents } from "../../../core/entity";
import { Scene, WithCamera } from "../../../core/scene";
import { PlayerController } from "../playerController";

export class Player extends PlayerController {
    constructor() {
        super('player');

        this.once(EntityEvents.SPAWN, () => {
            const s = this.scene as WithCamera<Scene>;
            s.camera.entityToFollow = this;
        })
    }
}
