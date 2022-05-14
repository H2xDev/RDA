import { V, Vector2 } from "../../core/utils/vector2";
import { Body } from "./body";

export class CharacterController extends Body {
    protected jumpSpeed = 30;
    protected movementSpeed = 200;
    protected acceleration = 0;

    private reachResolver?: () => void;
    private reachPromise?: Promise<void>;
    private movementTarget?: Vector2;

    public isMovementDisabled = false;

    constructor() {
        super();
    }

    protected get isOnGround () {
        return this.touchSide.bottom;
    }

    public move(a: number) {
        if (this.isMovementDisabled) return;
        if (!this.isOnGround) return;

        const { movementSpeed: m } = this;
        const av = { x: a * m, y: 0 };

        this.acceleration = a;
        this.addAcceleration(av);
    }

    public jump() {
        const { jumpSpeed } = this;

        if (this.isMovementDisabled) return;
        if (!this.touchSide.bottom) return;

        this.velocity.y = 0;
        this.addImpulse({ x: 0, y: -jumpSpeed });
    }

    public update() {
        super.update();
        this.moveTowards();
    }

    private moveTowards() {
        const { movementTarget: target } = this;
        const { isMovementDisabled, touchSide } = this;
        const { position, size, reachResolver } = this;

        if (isMovementDisabled) return;
        
        if (!target) return;

        const diff = V.onlyX(V.sub(target, position));
        const sign = V.sign(diff);
        const isTargetReached = V.mag(diff) < size.x;

        this.move(sign.x);
    
        if (touchSide.right || touchSide.left) {
            this.jump();
        }

        if (isTargetReached && reachResolver) {
            reachResolver();
            this.resetMoveTowards();
        }
    }

    private resetMoveTowards() {
        this.reachResolver = undefined;
        this.movementTarget = undefined;
        this.reachPromise = undefined;
    }

    public moveTo(target: Vector2) {
        if (this.reachResolver) return this.reachPromise!;
        this.movementTarget = target;

        this.reachPromise = new Promise<void>(resolve => {
            this.reachResolver = resolve;
        })

        return this.reachPromise;
    }
}
