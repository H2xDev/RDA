import { SpriteGroup } from "../../core/sprite";
import { CharacterController } from "./characterController";
import { V } from "../../core/utils/vector2";

export class Character extends CharacterController {
    private spriteGroup!: SpriteGroup<{ idle: string }>;

    constructor(private spriteName: string) {
        super();
        this.initSpriteGroup();
    }

    private initSpriteGroup() {
        const { spriteName } = this;

        this.spriteGroup = new SpriteGroup({
            idle: `${spriteName}/${spriteName}-idle.png`,
        }, {
            frameSize: [16, 16],
            offset: [8, 8],
            scale: [1, 1],
            speed: 0.1,
        });

        this.spriteGroup.state = 'idle';
        this.initSpriteGroupConditions();
    }

    private initSpriteGroupConditions() {
        const { spriteGroup } = this;

        const runIdleCondition = (state: 'run' | 'idle') => {
            switch (state) {
                case 'run':
                    return Math.abs(this.acceleration) > 0.5;
                case 'idle':
                    return Math.abs(this.acceleration) < 0.5;
            }
        }

        spriteGroup.condition('idle', runIdleCondition);
    }

    public update() {
        super.update();
        this.spriteGroup.render(...V.asArray(this.position));
    }
}
