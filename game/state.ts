import { StateManager } from '../core/state';

export const state = new StateManager({
    isLoading: false,
    gravity: { x: 0, y: 9.81 },
});
