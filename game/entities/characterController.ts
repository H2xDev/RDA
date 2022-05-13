import { V, Vector2 } from "../../core/utils/vector2";
import { renderer } from "../engine";
import { Body } from "./body";

export class CharacterController extends Body {
    protected jumpSpeed = 300;
    protected movementSpeed = 10;
    protected accelerationCooldownFactor = 0.8;
    protected acceleration: number = 0;

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

    public move(acc: number) {
        if (this.isMovementDisabled) return;
        if (!this.isOnGround) return;

        this.acceleration = acc;
    }

    public jump() {
        const { dt } = renderer;
        const { jumpSpeed } = this;

        if (this.isMovementDisabled) return;
        if (!this.touchSide.bottom) return;

        this.addImpulse({ x: 0, y: -jumpSpeed * dt });
    }

    public update() {
        super.update();
        this.applyAcceleration();
        this.moveTowards();
    }

    private applyAcceleration() {
        const { dt } = renderer;
        const { movementSpeed: m, acceleration: a } = this;
        const { accelerationCooldownFactor } = this;

        const av = { x: a * m * dt, y: 0 };

        this.addImpulse(av);
        this.acceleration *= accelerationCooldownFactor;
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
