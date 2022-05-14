import { Entity } from "../../core/entity";
import { Level } from "../../core/tiled/level";
import { V, Vector2 } from "../../core/utils/vector2";
import { context, renderer } from "../engine";
import { state } from "../state";
import { factorMultipiler } from "../utils";

export class Body extends Entity {
    protected friction = 1;
    protected frictions = {
        GROUND: 0.9,
        AIR: 0.99,
    }

    public isSolid = false;
    public useCollision = true;
    public useGravity = true;

    public velocity = { x: 0, y: 0 };
    public parentVelocity?: Vector2;
    public size = { x: 16, y: 16 };
    public actualVelocity = { x: 0, y: 0 };

    public area = {
        min: { x: -99999, y: -99999 },
        max: { x: 99999, y: 99999 },
    }

    public touchSide = {
        top: false,
        bottom: false,
        left: false,
        right: false,
    }

    private get halfSize() {
        return V.div(this.size, 2);
    }

    public setSolid(state: boolean) {
        this.isSolid = state;

        if (state) {
            Level.instance.addSolidArea(this);
            return;
        }

        Level.instance.removeSolidArea(this);
    }

    public update() {
        this.updateCollisionArea();
        this.checkParentVelocity();
        this.applyGravity();
        this.applyVelocity();
        this.clampPosition();

        this.updateFriction();
        this.applyFriction();

        this.render();
        this.renderCollisitonArea();
    }

    public addAcceleration(v: Vector2) {
        const { dt } = renderer;

        V.update(this.velocity).add(V.mul(v, dt));
    }

    public addImpulse(v: Vector2) {
        V.update(this.velocity).add(v);
    }
    
    private applyGravity() {
        if (!this.useGravity) return;
        
        const gravity = state.get('gravity');

        this.addAcceleration(gravity);
    }

    private applyVelocity() {
        const { dt } = renderer;
        const { position, velocity } = this;
        const { parentVelocity } = this;

        const positionUpdate = V.update(position).add(V.mul(velocity, dt));

        if (parentVelocity) {
            positionUpdate.add(V.mul(parentVelocity, dt));
        }
    }

    private applyFriction() {
        const { dt } = renderer;
        const { touchSide, velocity, friction } = this;

        if (touchSide.bottom) {
            velocity.x -= velocity.x * dt * (1 - friction) * 100
        }
    }

    private checkParentVelocity() {
        const { position, halfSize } = this;

        const bottomPos = V.add(position, V.onlyY(halfSize), { x: 0, y: 5 });
        const bottomBody = Level.instance
            .getSolidArea(...V.asArray(bottomPos)) as Body;

        if (bottomBody) {
            this.parentVelocity = bottomBody.actualVelocity;
            return;
        }

        this.parentVelocity = undefined;
    }

    private updateFriction() {
        if (!this.touchSide.bottom) {
            this.friction = this.frictions.AIR
            return;
        }

        this.friction = this.frictions.GROUND;
    }

    private clampPosition() {
        if (!this.useCollision) return;

        const { min, max } = this.area;
        const { position, halfSize } = this;
        const { velocity: v } = this;

        const one = { x: 1, y: 1 };
        const cmax = V.sub(max, halfSize, one);
        const cmin = V.add(min, halfSize, one);

        position.x = Math.max(cmin.x, Math.min(cmax.x, position.x));
        position.y = Math.max(cmin.y, Math.min(cmax.y, position.y));

        this.touchSide = {
            left: position.x <= cmin.x,
            right: position.x >= cmax.x,
            top: position.y <= cmin.y,
            bottom: position.y >= cmax.y,
        };

        const { left, right, top, bottom } = this.touchSide;

        if ((left && v.x < -1) || (right && v.x > 1)) {
            v.x = Math.sign(v.x);
        }

        if ((top && v.y < -1) || (bottom && v.y > 1)) {
            v.y = Math.sign(v.y);
        }
    }

    private renderCollisitonArea() {
        if (!this.isDebugging) return;

        const { min, max } = this.area;

        const [ w, h ] = V.asArray(V.sub(max, min));
        const { x, y } = min;

        context.save();
        context.globalAlpha = 0.25;
        context.fillStyle = this.debugColor;
        context.fillRect(x, y, w, h);
        context.restore();
    }

    private render() {
        if (!this.isDebugging) return;

        const { debugColor, halfSize, position, size } = this;
        const renderPosition = V.sub(position, halfSize);

        context.strokeStyle = debugColor;
        context.strokeRect(...V.asArray(renderPosition), ...V.asArray(size));
    }

    private resetTouches() {
        this.touchSide = {
            top: false,
            bottom: false,
            left: false,
            right: false,
        };
    }

    private resetCollisionArea() {
        const { area } = this;

        area.min = { x: -99999, y: -99999 };
        area.max = { x: 99999, y: 99999 }
    }

    public updateCollisionArea() {
        if (!this.useCollision) return;
        const { halfSize: h, velocity: v } = this;
        const { area, position, size } = this;

        const SIDE_DIVIDER = 8;
        const CYCLE_LENGTH = 100;

        this.resetTouches();
        this.resetCollisionArea();

        for (let i = 0; i < CYCLE_LENGTH; i++) {
            for (let j = 0; j <= (size.y / SIDE_DIVIDER) >> 0; j += 1) {
                const cy = -h.y + j * SIDE_DIVIDER;

                const ox = V.add(position, V.onlyX(h));
                const checkPos = V.add(ox, { x: i * Math.sign(v.x), y: cy });
                const isCollided = Level.instance.checkSolid(...V.asArray(checkPos));

                if (isCollided) {
                    if (v.x > 0 && checkPos.x < area.max.x) {
                        area.max.x = checkPos.x;
                    } else if (v.x < 0 && checkPos.x > area.min.x) {
                        area.min.x = checkPos.x;
                    }
                }
            }

            for (let j = 0; j <= (size.x / SIDE_DIVIDER) >> 0; j += 1) {
                const cx = -h.x + j * SIDE_DIVIDER;

                const oy = V.add(position, V.onlyY(h));
                const checkPos = V.add(oy, { x: cx, y: i * Math.sign(v.y) });
                const isCollided = Level.instance.checkSolid(...V.asArray(checkPos));

                if (isCollided) {
                    if (v.y > 0 && checkPos.y < area.max.y) {
                        area.max.y = checkPos.y;
                    } else if (v.y < 0 && checkPos.y > area.min.y) {
                        area.min.y = checkPos.y;
                    }
                }
            }
        }
    }
}
