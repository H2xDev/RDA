import Vue from "vue";
import { FadeEvents, FadeService } from "../../services/fade.service";

export default Vue.extend({
    data: () => ({
        isFaded: false,
    }),

    created() {
        FadeService.Component = this;
    },
    
    methods: {
        onFaded() {
            FadeService.trigger(FadeEvents.FADE_IN_END);
            this.$emit('faded');
        },
        onUnfaded() {
            FadeService.trigger(FadeEvents.FADE_OUT_END);
            this.$emit('unfaded');
        }
    }
})
