import { Entity } from "./entity";
export declare class Camera extends Entity {
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
    constructor();
    private overrideRendering;
    private applyResolution;
    private get actualZoom();
    private moveCameraToTarget;
    update(): void;
    applyCameraTransform(): void;
}
