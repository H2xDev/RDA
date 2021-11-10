import { Entity } from "./entity";
export declare class Camera extends Entity {
    private context;
    resolution: [number, number];
    originalResolution: [number, number];
    position: {
        x: number;
        y: number;
    };
    rotation: number;
    zoom: number;
    entityToFollow?: Entity;
    followSmoothness: number;
    private sceneUpdate;
    constructor(context: CanvasRenderingContext2D);
    private overwriteRendering;
    private applyResolution;
    private get actualZoom();
    private moveCameraToTarget;
    update(): void;
    applyCameraTransform(): void;
}
