import { EventEmitter } from "../../core/event";
import { V, Vector2 } from "../../core/utils/vector2";
import { renderer } from "../engine";
import { Bullet } from "../entities/bullet";

export enum WeaponEvent {
    AMMO_UPDATED = 'ammoUpdated',
    AMMO_OUT = 'ammoOut',
}

type BulletType = new (...args: ConstructorParameters<typeof Bullet>) => Bullet;

export class Weapon extends EventEmitter<WeaponEvent> {
    public ammo = 0;
    public infiniteAmmo = false;
    public bulletSpeed = 30;

    constructor(private BulletConstructor: BulletType) {
        super();
    }

    public shoot(from: Vector2, direction: Vector2) {
        if (renderer.isPaused) return;

        const d = V.mul(V.normalize(direction), this.bulletSpeed);

        return new this.BulletConstructor(from, d);
    }
}
