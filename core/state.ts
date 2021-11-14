import {EventEmitter} from "./event";

export enum StateEvent {
    UPDATED
}

export class StateManager<T extends {}> extends EventEmitter<StateEvent> {
    constructor(private state:T) {
        super();
        this.defineProxy();
    }

    private defineProxy() {
        this.state = new Proxy(this.state, {
            set: (t: T & { [k: string]: any }, p: string, v: any) => {
                const oldValue = t[p];

                if (oldValue !== v) {
                    this.trigger(StateEvent.UPDATED, [v, oldValue]);
                }

                return Reflect.set(t, p, v);
            }
        });
    }
}
