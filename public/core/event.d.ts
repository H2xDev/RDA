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
export declare type EventHandler<T = any, H = void> = (details: T) => H;
export declare type UnsubscribeFunction = () => void;
export interface EventListener<E extends (string | number) = string, T = any, H = void> {
    handler: EventHandler<T, H>;
    options: EventListenerOptions;
    event: E;
}
export interface EventEmitterTypes<E extends (string | number) = string> {
    [eventName: string]: EventListener<E>[];
}
export declare class EventEmitter<EventList extends (string | number) = string> {
    private events;
    /**
     *
     * @param event Event type
     * @param handler listener
     * @param options options
     */
    on<T = any, H = void>(event: EventList, handler: EventHandler<T, H>, options?: EventListenerOptions): UnsubscribeFunction;
    once<T = any, H = void>(...args: Parameters<EventEmitter<EventList>['on']>): UnsubscribeFunction;
    trigger<T = any>(eventName: EventList, details?: T): void;
    private checkEventListener;
    removeListener(event: EventList, handler: EventHandler): void;
    private isEventTypeDefined;
    private defineEventType;
}
declare const _default: {};
export default _default;
