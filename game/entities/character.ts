import { renderer } from "../engine";
import { V } from "../../core/utils/vector2";
import { SpriteGroup, SpriteOptions } from "../../core/sprite";
import { CharacterController } from "./characterController";
import { Item } from "./item";

type CharacterSpriteStates = {
    idle: string;
    run: string;
    fly: string;
}

export class Character extends CharacterController {
    public spriteGroup!: SpriteGroup<CharacterSpriteStates>;
    public equippedItem?: Item;

    constructor(private spriteName: string) {
        super();
        this.initSpriteGroup();
    }

    private initSpriteGroup() {
        const { spriteName } = this;
        const path = `${spriteName}/${spriteName}-`;
        const entries = ['idle', 'run', 'fly']
            .map(e => [e, path + e + '.png']);

        const spriteSet = Object.fromEntries(entries);
        const options: SpriteOptions = {
            frameSize: [32, 32],
            offset: [16, 16],
            scale: [1, 1],
            speed: 0.1,
        };

        this.spriteGroup = new SpriteGroup(spriteSet, options);
        this.spriteGroup.state = 'idle';

        this.initSpriteGroupConditions();
    }

    private initSpriteGroupConditions() {
        const { spriteGroup } = this;

        const runIdleCondition = (state: 'run' | 'idle') => {
            const { dt } = renderer;
            if (!this.isOnGround) return false;

            const { spriteGroup } = this;
            const { scale } = spriteGroup;

            switch (state) {
                case 'run':
                    scale[0] = Math.sign(this.acceleration) || scale[0];
                    this.spriteGroup.speed = Math.abs(this.acceleration) * 2 * dt;

                    return Math.abs(this.acceleration) > 0.5;
                case 'idle':
                    return Math.abs(this.acceleration) < 0.5;
            }
        }


        spriteGroup.condition('idle', runIdleCondition);
        spriteGroup.condition('run', runIdleCondition);
        spriteGroup.condition('fly', () => Math.abs(this.velocity.y) > 0.1);
    }

    public update() {
        super.update();
        this.spriteGroup.render(...V.asArray(this.position));
        this.updateEquippedItem();
    }

    public equipItem(item: Item) {
        this.unequipCurrentItem();

        item.equipFor(this);
        this.equippedItem = item;
    }

    public unequipCurrentItem() {
        if (!this.equippedItem) return;
        this.equippedItem.unequip();
        this.equippedItem = undefined;
    }

    public updateEquippedItem() {
        const { equippedItem } = this;
        if (!equippedItem) return;

        equippedItem.updateEquipped();
    }
}
