import { Entity, EntityEvents } from "./entity";
import {Scene, WithCamera} from "./scene";
import {VectorLike} from "./utils/vectorUtil";

export class Camera extends Entity {
    public resolution: [ number, number ] = [1, 1];
    public originalResolution: [ number, number ] = [1, 1];
    public position = {
        x: 0,
        y: 0,
    }
    public rotation = 0;
    public zoom = 1;
    public entityToFollow?: { position: VectorLike };
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
        if (!this.resolution) return [1, 1];
        return [
            this.originalResolution[0] / (this.resolution[0] / this.zoom),
            this.originalResolution[1] / (this.resolution[1] / this.zoom),
        ]
    }

    private moveCameraToTarget() {
        if (!this.entityToFollow) return;

        let { x: tx, y: ty } = this.entityToFollow.position;

        ty -= 150;

        this.position.x -= (this.position.x - tx) / this.followSmoothness;
        this.position.y -= (this.position.y - ty) / this.followSmoothness;
    }

    public update() {
        const { context: c } = this;
        const scene = this.scene as WithCamera<Scene>;
        if (!this.sceneUpdate) return;

        this.moveCameraToTarget();

        scene.beforeCamera?.();
        c.save()
        this.applyCameraTransform();
        this.sceneUpdate();
        c.restore();
    }

    public applyCameraTransform() {
        const { context: c } = this;
        const rw = this.resolution[0] / this.zoom;
        const rh = this.resolution[1] / this.zoom;

        if (this.area[0]) {
            this.position.x = Math.min(rw / 2, Math.max(this.area[0] - rw / 2));
        }

        if (this.area[1]) {
            this.position.y = Math.min(rh / 2, Math.max(this.area[1] - rh / 2));
        }

        c.translate(this.resolution[0] / 2, this.resolution[1] / 2);
        c.rotate(this.rotation / 180 * Math.PI);
        c.scale(...this.actualZoom);
        c.translate(-this.position.x, -this.position.y);
    }
}
