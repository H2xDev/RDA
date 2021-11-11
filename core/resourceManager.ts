import { EventEmitter } from "./event";
import { ResourceEvents } from "./types/fileManagerEvents.enum";

export enum ResourceManagerEvents {
    LOADING_FINISHED,
    LOADING_STARTED,
}

interface ResourceEventDetail {
    [ResourceEvents.LOADED]: Resource,
}

export class ResourceManager extends EventEmitter<ResourceManagerEvents> {
    public pendingObjects: EventEmitter<ResourceEvents>[] = [];
    
    private _loadingState = false;
    
    private get isLoading() {
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
    }

    public removeResource(res: Resource) {
        this.pendingObjects = this.pendingObjects.filter((e) => e !== res);

        if (!this.pendingObjects.length) {
            this.isLoading = false;
        }
    }
}

export class Resource<EventList extends (string | number) = any> extends EventEmitter<ResourceEvents | EventList> {
    static Manager: ResourceManager;
    
    constructor() {
        super();
        this.loadResource();
    }

    private loadResource() {
        Resource.Manager.addResource(this);
    }
}
