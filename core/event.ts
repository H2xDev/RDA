/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Event Listener Options
 */
export interface EventListenerOptions {
    /**
     * Removes the listener after the trigger
     */
    once?: boolean;
    /**
     * Removes the listener after the trigger a certain number of times
     */
    takes?: number;
}

/**
 * @param T - type of details
 * @param H - type of return value
 */
export type EventHandler<T = any, H = void> = (details: T) => H;

export type UnsubscribeFunction = () => void;

export interface EventListener<E extends (string | number) = string, T = any, H = void> {
    handler: EventHandler<T, H>;
    options: EventListenerOptions;
    event: E;
}

export interface EventEmitterTypes<E extends (string | number) = string> {
    [eventName: string]: EventListener<E>[];
}

export class EventEmitter<EventList extends (string | number) = string> {
    private events: EventEmitterTypes<EventList> = {}

    /**
     *
     * @param event Event type
     * @param handler listener
     * @param options options
     */
    public on<T = any, H = void>(
        event: EventList,
        handler: EventHandler<T, H>,
        options: EventListenerOptions = {},
    ): UnsubscribeFunction {
        if (!this.isEventTypeDefined(event)) {
            this.defineEventType(event);
        }

        const eventListener: EventListener<EventList> = {
            handler,
            options,
            event,
        };

        this.events[event].push(eventListener);

        return () => this.unsub(event, eventListener.handler);
    }

    public once(...args: Parameters<EventEmitter<EventList>['on']>) {
        args[2] = args[2] ? { ...args[2], once: true } : { once: true };
        return this.on(...args);
    }

    public trigger<T = any>(eventName: EventList, details?: T): void {
        if (!this.isEventTypeDefined(eventName)) {
            return;
        }
        this.events[eventName].forEach((eventListener) => {
            eventListener.handler.bind(this)(details);
        });
        this.events[eventName].forEach(this.checkEventListener.bind(this));
    }

    public unsub(event: EventList, handler: EventHandler): void {
        this.events[event] = this.events[event].filter((e) => e.handler !== handler);

        if (!this.events[event].length) {
            delete this.events[event];
        }
    }

    private checkEventListener(eventListener: EventListener<EventList>): void {
        const { event: eventName } = eventListener;
        if (eventListener.options.once) {
            this.unsub(eventName, eventListener.handler);
        }

        if (typeof eventListener.options.takes === 'number') {
            // eslint-disable-next-line no-param-reassign
            eventListener.options.takes -= 1;
            if (eventListener.options.takes === 0) {
                this.unsub(eventName, eventListener.handler);
            }
        }
    }

    private isEventTypeDefined(eventName: EventList): boolean {
        return !!this.events[eventName];
    }

    private defineEventType(eventName: EventList): void {
        this.events[eventName] = [];
    }
}

export default {};
