import { EventEmitter } from "./event";
import { ResourceEvents } from "./types/fileManagerEvents.enum";

export class ResourceManager extends EventEmitter {
    public pendingObjects: EventEmitter<FileManagerEvents>[] = [];

    addResource(res: Resource) {
        res.once(ResourceEvents.FILE_LOADED);
    }
}

export class Resource<EventList extends (string | number) = string> extends EventEmitter<FileManagerEvents | EventList> {
    static Manager: ResourceManager;
    
    
    constructor() {
        super();

        this.addResource();
    }

    private addResource() {
        Resource.Manager.addFile(this);
    }
}