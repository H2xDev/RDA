import { EventEmitter } from "../../core/event";
import Fade from '../gui/fade/fade';

export enum FadeEvents {
    FADE_IN_END = 'fadeInEnd',
    FADE_OUT_END = 'fadeOutEnd',
}

export const FadeService = new (
    class FadeService extends EventEmitter<FadeEvents> {
        public Component!: Mounted<typeof Fade>;

        constructor() {
            super();
        }

        public async fade(fadeOut = true) {
            return new Promise((resolve) => {
                this.Component.$once('faded', resolve);
                this.Component.isFaded = true;
            })
            .then(() => {
                this.Component.isFaded = !fadeOut;
            });
        }
    }
)
