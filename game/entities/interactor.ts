import { Entity } from "../../core/entity";
import { Body } from "./body";
import { Interactable, InteractEvent } from "./interactable";

export class Interactor extends Entity {
    private currentEntity?: Interactable;

    public update() {
        if (!this.parent) return;
        if (!(this.parent instanceof Body)) return;

        const { scene } = this.parent;
        this.currentEntity = undefined;

        for (const id in scene.children) {
            const entity = scene.children[id];
            const isInteractable = entity instanceof Interactable;
            const isIntersected = this.parent.checkIntersectionWith(entity as Body);

            if (isInteractable && isIntersected) {
                this.currentEntity = entity as Interactable;
            }
        }
    }

    public interact() {
        this.currentEntity?.trigger(InteractEvent.INTERACT, this);
    }
}
