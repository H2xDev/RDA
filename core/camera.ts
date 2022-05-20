import { Entity, EntityEvents } from "./entity";
import { Scene, WithCamera } from "./scene";
import { ContextHelper } from "./utils/contextHelpers";
import { V, Vector2 } from "./utils/vector2";

export class Camera extends Entity {
    public resolution: [ number, number ] = [1, 1];
    public originalResolution: [ number, number ] = [1, 1];
    public rotation = 0;
    public zoom = 1;
    public targetZoom = 1;
    public entityToFollow?: { position: Vector2 };
    public followSmoothness = 16;
    public area = [0, 0];

    private sceneUpdate!: () => void;

    constructor(private context: CanvasRenderingContext2D) {
        super();
        this.once(EntityEvents.SPAWN, () => {
            this.applyResolution();
            this.overwriteRendering();
        });
    }

    private overwriteRendering() {
        this.sceneUpdate = this.scene.update.bind(this.scene);
        this.scene.update = this.update.bind(this);
    }

    private applyResolution() {
        const { context } = this;

        this.resolution = [
            context.canvas.width,
            context.canvas.height,
        ]

        this.originalResolution = [
            context.canvas.width,
            context.canvas.height,
        ]
    }

    private get actualZoom(): [number, number] {
        const { originalResolution, resolution, zoom } = this;
        const [ ox, oy ] = originalResolution;
        const [ rx, ry ] = resolution;

        if (!this.resolution) return [1, 1];

        return [
            ox / rx,
            oy / ry,
        ]
    }

    private moveCameraToTarget() {
        if (!this.entityToFollow) return;

        const { followSmoothness, position } = this;
        const { position: target } = this.entityToFollow;

        this.zoom -= (this.zoom - this.targetZoom) / followSmoothness;

        V.update(position)
            .lerp(target, followSmoothness);
    }

    public update() {
        const scene = this.scene as WithCamera<Scene>;
        if (!this.sceneUpdate) return;

        this.moveCameraToTarget();

        scene.beforeCamera?.();

        ContextHelper
            .isolatedTransform(() => {
                this.updateZoom();
                this.applyCameraTransform();
                this.sceneUpdate();
            })
    }

    public updateZoom() {
        const { zoom: z, context } = this;
        this.originalResolution[0] = context.canvas.width * z;
        this.originalResolution[1] = context.canvas.height * z;
    }

    public applyCameraTransform() {
        const { context: c } = this;

        c.translate(this.resolution[0] / 2, this.resolution[1] / 2);
        c.rotate(this.rotation / 180 * Math.PI);
        c.scale(...this.actualZoom);
        c.translate(-this.position.x, -this.position.y);
    }

    public resetPosition() {
        if (!this.entityToFollow) return;

        V.update(this.position).set(this.entityToFollow?.position);
    }
}
