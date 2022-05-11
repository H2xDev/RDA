import { EventEmitter } from "./event";
import { ResourceEvents } from "./types/fileManagerEvents.enum";

export enum ResourceManagerEvents {
    LOADING_FINISHED,
    LOADING_STARTED,
}

export class ResourceManager extends EventEmitter<ResourceManagerEvents> {
    public pendingObjects: EventEmitter<ResourceEvents>[] = [];
    
    private _loadingState = false;
    
    public get isLoading() {
        return this._loadingState;
    } 

    private set isLoading(value) {
        if (this._loadingState !== value) {
            this._loadingState = value;
      
            this.trigger(value
                ? ResourceManagerEvents.LOADING_STARTED
                : ResourceManagerEvents.LOADING_FINISHED
            );
        }
    }

    public addResource(res: Resource) {
        res.once(ResourceEvents.LOADED, () => {
            this.removeResource(res);
        });
        this.pendingObjects.push(res);
        this.isLoading = true;
        return res;
    }

    public removeResource(res: Resource) {
        this.pendingObjects = this.pendingObjects.filter((e) => e !== res);

        if (!this.pendingObjects.length) {
            this.isLoading = false;
        }
    }
}

export const DefaultResourceManager = new ResourceManager();

export abstract class Resource<T extends (string | number) = any> extends EventEmitter<ResourceEvents | T> {
    static Manager: ResourceManager = DefaultResourceManager;
    static Events = ResourceEvents;

    public isLoaded = false;

    constructor() {
        super();
        this.loadResource();
    }

    private loadResource() {
        Resource.Manager.addResource(this);
        this.once(ResourceEvents.LOADED, () => { this.isLoaded = true; });
    }
}
