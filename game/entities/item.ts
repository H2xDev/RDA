import Sprite from "../../core/sprite";
import { V } from "../../core/utils/vector2";
import { context } from "../engine";
import { InventoryService } from "../services/inventory.service";
import { Character } from "./character";
import { Interactable } from "./interactable";


export abstract class Item extends Interactable {
    public equipable = false;
    public name = 'Unnamed Item'
    public description = 'description'
    public sprite?: Sprite;

    protected equippedBy?: Character;

    public get isEquipped() {
        return !!this.equippedBy;
    }

    public update() {
        super.update();

        const { position, sprite } = this;

        if (!sprite) return;

        this.renderRhombus();

        sprite.render(...V.asArray(position));
    }

    private renderRhombus() {
        const { x, y } = this.position;
        const size = 24;
        const t = performance.now() / 1000;

        context.save();
        context.translate(x, y);
        context.rotate(Math.PI / 4 + t);
        context.strokeStyle = '#5af';
        context.strokeRect(size / -2, size / -2, size, size);

        context.rotate(Math.PI / 4 + t);
        context.scale(0.9, 0.9);
        context.strokeRect(size / -2, size / -2, size, size);

        context.restore();
    }

    public equipFor(character: Character) {
        this.equippedBy = character;
        character.equippedItem = this;
    }

    public unequip() {
        this.equippedBy = undefined;
    }

    public updateEquipped() {}

    protected onInteract() {
        this.destroy();
        InventoryService.addItem(this);
    }
}

