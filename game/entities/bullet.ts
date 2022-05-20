import { Level } from "../../core/tiled/level";
import { V, Vector2 } from "../../core/utils/vector2";
import { sceneController } from "../engine";
import { Body } from "./body";

export class Bullet extends Body {
    public size = { x: 8, y: 8 };
    public useGravity = false;
    public useFriction = false;
    public useCollision = false;

    public p = [] as ReturnType<typeof Level.instance['checkSolidByVector']>[];

    constructor(private startPosition: Vector2, private startVelocity: Vector2) {
        super();
        sceneController.currentScene.addEntity(this);

        V.update(this.velocity).set(this.startVelocity);
        V.update(this.position).set(this.startPosition);
    }

    public update() {
        this.checkRicochet();
        this.setDebug(true);
        super.update();
    }

    private checkRicochet() {
        const { position, velocity } = this;

        const pos = position;
        const d = Level.instance
            .checkSolidByVector(pos.x, pos.y, velocity, V.mag(velocity) / 2);

        const { collided, point, reflected } = d;

        if (!collided) return;

        this.p.push(d);
        
        V.update(velocity)
            .set(reflected);

        V.update(position)
            .set(point)
    }
}
