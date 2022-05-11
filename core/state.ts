import { EventEmitter } from "./event";

export enum StateEvent {
    UPDATED
}

export class StateManager<T extends {}> extends EventEmitter<StateEvent> {
    constructor(private state:T) {
        super();
        this.defineProxy();
    }

    private defineProxy() {
        const config = {
            set: (t: T & { [k: string]: any }, p: string, v: any) => {
                const oldValue = t[p];

                if (oldValue !== v) {
                    this.trigger(StateEvent.UPDATED, [v, oldValue]);
                }

                return Reflect.set(t, p, v);
            }
        }

        this.state = new Proxy(this.state, config);
    }

    public get<K extends keyof T>(key: K): T[K] {
        return this.state[key];
    }
}
