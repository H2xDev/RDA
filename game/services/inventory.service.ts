import { EventEmitter } from "../../core/event";
import { Item } from "../entities/item";
import { PlayerController } from "../entities/playerController";
import Inventory from '../gui/inventory/Inventory.vue';

export enum InventoryEvents {
    ITEM_ADDED = 'itemAdded',
}

export const InventoryService = new (
    class InventoryService extends EventEmitter<InventoryEvents> {
        public Component = Inventory;
        public player!: PlayerController;

        private items: Item[] = [];
        private guiElement!: Mounted<Inventory>;

        public setGUIElement(el: typeof this.guiElement) {
            this.guiElement = el;
        }

        public open() {
            this.guiElement.isOpened = true;
            this.guiElement.items = this.items;
        }

        public close() {
            this.guiElement.isOpened = false;
        }

        public addItem(item: Item) {
            const { items } = this;
            items.push(item);
            this.trigger(InventoryEvents.ITEM_ADDED, { item, items })

            if (item.equipable) {
                item.equipFor(this.player);
            }
        }
    }
)
