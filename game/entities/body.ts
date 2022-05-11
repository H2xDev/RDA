import { Entity } from "../../core/entity";
import { Level } from "../../core/tiled/level";
import { V, Vector2 } from "../../core/utils/vector2";
import { context } from "../engine";
import { state } from "../state";

const MAX_RAY_LENGTH = 200;

export class Body extends Entity {
    public isSolid = false;
    public useCollision = true;
    public useGravity = true;

    public velocity = { x: 0, y: 0 };
    public parentVelocity?: Vector2;
    public size = { x: 16, y: 16 };
    public actualVelocity = { x: 0, y: 0 };
    protected friction = 1;

    public area = {
        min: { x: -99999, y: -99999 },
        max: { x: 99999, y: 99999 },
    }

    public oarea = {
        min: { x: -1, y: -1 },
        max: { x: 1, y: 1 },
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
    
    private applyGravity() {
        if (!this.useGravity) return;

        const { velocity } = this;
        const gravity = state.get('gravity');
        V.update(velocity).add(gravity);

        if (this.touchSide.bottom) {
            velocity.y = 0;
        }
    }

    private applyVelocity() {
        const { position, velocity } = this;
        const { parentVelocity, friction } = this;

        const posBefore = V.copy(position);
        const positionUpdate = V.update(position).add(velocity);
        
        if (parentVelocity) {
            positionUpdate.add(parentVelocity);
        }

        V.update(velocity).mul2({ x: friction, y: 1 });

        this.actualVelocity = V.sub(position, posBefore);
    }

    private updateParentVelocity() {
        const { position, halfSize } = this;

        const bottomPos = V.add(position, V.onlyY(halfSize), { x: 0, y: 5 });
        const bottomBody = Level.instance.getSolidArea(...V.asArray(bottomPos)) as Body;

        if (bottomBody) {
            this.parentVelocity = bottomBody.actualVelocity;
            return;
        }

        this.parentVelocity = undefined;
    }

    private updateFriction() {
        if (!this.touchSide.bottom) {
            this.friction = 0.99;
            return;
        }

        this.friction = 0.8;
    }

    private clampPosition() {
        if (!this.useCollision) return;

        const { min, max } = this.area;
        const { position, halfSize } = this;

        const cmax = V.sub(max, halfSize);
        const cmin = V.add(min, halfSize);

        position.x = Math.max(cmin.x, Math.min(cmax.x, position.x));
        position.y = Math.max(cmin.y, Math.min(cmax.y, position.y));
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
        this.updateFriction();
        this.updateParentVelocity();
        this.applyGravity();
        this.applyVelocity();
        this.clampPosition();

        this.render();
        // this.renderCollisitonArea();
    }

    private render() {
        if (!this.isDebugging) return;

        const { debugColor, halfSize, position, size } = this;
        const renderPosition = V.sub(position, halfSize);

        context.strokeStyle = debugColor;
        context.strokeRect(...V.asArray(renderPosition), ...V.asArray(size));
    }

    public addImpulse(v: Vector2) {
        V.update(this.velocity).add(v);
    }

    public updateCollisionArea() {
        if (!this.useCollision) return;

        const { halfSize: h, size, position } = this;
        const SIDE_DIVIDER = 2;
        const xMinValues: number[] = [];
        const xMaxValues: number[] = [];
        const yMinValues: number[] = [];
        const yMaxValues: number[] = [];

        this.touchSide = {
            top: false,
            bottom: false,
            left: false,
            right: false,
        }

        for (let i = 0; i < MAX_RAY_LENGTH; i++) {
            let leftChecked = false;
            let rightChecked = false;
            const isFirstItteration = i < 3;

            for (let j = 1; j <= ((size.y - 2) / SIDE_DIVIDER) >> 0; j += SIDE_DIVIDER) {
                const cy = -h.y + j;

                if (!leftChecked) {
                    const ox = V.add(position, V.mul(V.onlyX(h), -1));
                    const checkPos = V.add(ox, { x: -i, y: cy });
                    const isCollided = Level.instance.checkSolid(...V.asArray(checkPos));

                    if (isCollided) {
                        while (Level.instance.checkSolid(...V.asArray(checkPos))) {
                            V.update(checkPos).add({ x: 1, y: 0 });
                        }

                        xMinValues.push(checkPos.x);
                        leftChecked = true;

                        if (isFirstItteration) {
                            this.touchSide.left = true;
                        }
                    }
                }

                if (!rightChecked) {
                    const ox = V.add(position, V.onlyX(h));
                    const checkPos = V.add(ox, { x: i, y: cy });
                    const isCollided = Level.instance.checkSolid(...V.asArray(checkPos));

                    if (isCollided) {
                        while (Level.instance.checkSolid(...V.asArray(checkPos))) {
                            V.update(checkPos).sub({ x: 1, y: 0 });
                        }

                        xMaxValues.push(checkPos.x);
                        rightChecked = true;

                        if (isFirstItteration) {
                            this.touchSide.right = true;
                        }
                    }
                }

                if (rightChecked && leftChecked) break;
            }


            let topChecked = false;
            let bottomChecked = false;

            for (let j = 1; j <= ((size.x - 2) / SIDE_DIVIDER) >> 0; j += SIDE_DIVIDER) {
                const cx = -h.x + j;

                if (!topChecked) {
                    const oy = V.add(position, V.mul(V.onlyY(h), -1));
                    const checkPos = V.add(oy, { x: cx, y: -i });
                    const isCollided = Level.instance.checkSolid(...V.asArray(checkPos));

                    if (isCollided) {
                        while (Level.instance.checkSolid(...V.asArray(checkPos))) {
                            V.update(checkPos).add({ x: 0, y: 1 });
                        }

                        yMinValues.push(checkPos.y);
                        topChecked = true;

                        if (isFirstItteration)
                            this.touchSide.top = true;
                    }
                }

                if (!bottomChecked) {
                    const oy = V.add(position, V.onlyY(h));
                    const checkPos = V.add(oy, { x: cx, y: i });
                    const isCollided = Level.instance.checkSolid(...V.asArray(checkPos));

                    if (isCollided) {
                        while (Level.instance.checkSolid(...V.asArray(checkPos))) {
                            V.update(checkPos).sub({ x: 0, y: 1 });
                        }

                        yMaxValues.push(checkPos.y);
                        bottomChecked = true;

                        if (isFirstItteration)
                            this.touchSide.bottom = true;
                    }
                }

                if (topChecked && bottomChecked) break;
            }
        }
        
        this.area.min.x = xMinValues.length ? Math.max(...xMinValues) : -99999;
        this.area.min.y = yMinValues.length ? Math.max(...yMinValues) : -99999;
        this.area.max.x = xMaxValues.length ? Math.min(...xMaxValues) : 99999;
        this.area.max.y = yMaxValues.length ? Math.min(...yMaxValues) : 99999;
    }
}
