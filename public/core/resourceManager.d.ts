import { EventEmitter } from "./event";
import { ResourceEvents } from "./types/fileManagerEvents.enum";
export declare enum ResourceManagerEvents {
    LOADING_FINISHED = 0,
    LOADING_STARTED = 1
}
export declare class ResourceManager extends EventEmitter<ResourceManagerEvents> {
    pendingObjects: EventEmitter<ResourceEvents>[];
    private _loadingState;
    get isLoading(): boolean;
    private set isLoading(value);
    addResource(res: Resource): Resource<any>;
    removeResource(res: Resource): void;
}
export declare const DEFAULT_RESOURCE_MANAGER: ResourceManager;
export declare class Resource<T extends (string | number) = any> extends EventEmitter<ResourceEvents | T> {
    static Manager: ResourceManager;
    static Events: typeof ResourceEvents;
    isLoaded: boolean;
    constructor();
    private loadResource;
}
