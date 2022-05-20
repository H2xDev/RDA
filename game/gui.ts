import Vue from 'vue';
import MainComponent from './gui/MainComponent.vue';

import { renderer, sceneController } from './engine';
import { Scene } from '../core/scene';
import { RendererEvent } from '../core/renderer';
import { SceneControllerEvent } from '../core/sceneController';
import {KCodes, keyboardInput} from '../core/input';

const vm = new Vue({
    el: '#gui',
    components: {
        MainComponent,
    },
    data: () => ({
        uiComponent: '',
        isPaused: false,
    }),
    methods: {
        setPause(state: boolean) {
            renderer.setPause(state);
        }
    }
});

vm.$mount('#gui');

sceneController
    .on<Scene>(SceneControllerEvent.SCENE_CHANGED, (s) => {
        if (!s) {
            vm.uiComponent = '';
            return;
        }
        vm.uiComponent = s.meta.uiComponent;
    });

renderer
    .on<boolean>(RendererEvent.PAUSE_STATE_CHANGED, (state) => {
        vm.isPaused = state;
    });

keyboardInput
    .on('up:' + KCodes.K_ESC, () => {
        renderer.setPause(!vm.isPaused);
    })
