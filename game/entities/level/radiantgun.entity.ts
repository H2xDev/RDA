import { Entity, EntityEvents } from "../../../core/entity";
import { keyboardInput, mouseInput, MouseInputEvent } from "../../../core/input";
import Sprite from "../../../core/sprite";
import { Level } from "../../../core/tiled/level";
import { V } from "../../../core/utils/vector2";
import { context } from "../../engine";
import { SceneWithCamera } from "../../scenes/sceneWithCamera";
import { Weapon } from "../../services/weapon.service";
import { Bullet } from "../bullet";
import { Item } from "../item";

export class RadiantGun extends Item {
    public name = 'Radiant Gun';
    public description = "The base gun that shoots energy"
    public equipable = true;
    public useGravity = false;
    public useCollision = false;
    public size = { x: 16, y: 16 };
    public startPosition = V.zero();

    public sprite = new Sprite('items/radiant-gun.png', {
        frameSize: [16, 16],
        offset: [8, 8],
    });

    private weapon = new Weapon(Bullet, this as Entity<number>);

    constructor() {
        super();
        this.once(EntityEvents.SPAWN, this.onSpawn.bind(this));
        mouseInput.on(MouseInputEvent.LEFT_CLICK, this.shoot.bind(this))
    }

    public update() {
        this.position.y = this.startPosition.y + Math.cos(performance.now() / 500) * 4;
        super.update();
    }

    public onSpawn() {
        this.startPosition = V.copy(this.position);
    }

    public updateEquipped() {
        const { spriteGroup } = this.equippedBy!;
        const { origin, angle } = this.getWeaponPosition();

        this.sprite.render(...V.asArray(origin));
        this.sprite.scale[1] = spriteGroup.scale[0];
        this.sprite.angle = angle * 180 / Math.PI;
    }

    private getWeaponPosition() {
        const { position } = this.equippedBy!;
        const { camera } = this.scene as SceneWithCamera;

        const hres = V.div(V.fromArray(camera.resolution), 2);
        const mc = V.sub(camera.position, mouseInput.position, hres);
        const dist = V.dist2(mc, position);
        const angle = Math.atan2(dist.y, dist.x) + Math.PI;
        const origin = V.add(V.fromAngle(angle, 10), position);

        const d = Level.instance.checkSolidByVector(origin.x, origin.y, V.fromAngle(angle), 1000);

        if (d.collided) {
            context.beginPath();
            context.moveTo(origin.x, origin.y);
            context.lineTo(d.point.x, d.point.y);
            context.stroke();

            context.strokeStyle = "#f00";
            context.beginPath();
            context.moveTo(d.point.x, d.point.y);
            context.lineTo(...V.asArray(V.add(d.point, V.mul(d.normal, 10))));
            context.stroke();
        }

        return {
            origin,
            angle,
            direction: dist,
        }
    }

    private shoot() {
        const { origin, angle } = this.getWeaponPosition();

        this.weapon.shoot(origin, V.fromAngle(angle));
    }
}
