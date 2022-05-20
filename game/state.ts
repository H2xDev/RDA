import { StateManager } from '../core/state';
import { PlayerController } from './entities/playerController';

export const state = new StateManager({
    isLoading: false,
    gravity: { x: 0, y: 9.81 },
    player: undefined as PlayerController | undefined,
});
