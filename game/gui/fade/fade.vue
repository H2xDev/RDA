<template>
	<transition name="fade" mode="out-in" @after-enter="onFaded" @after-leave="onUnfaded">
	<div class="fade fullsize" v-show="isFaded"/>
	</transition>
</template>

<script>
import Fade from './fade';
export default Fade;
</script>

<style lang="scss">
.fade {
	background-color: #000;
	transition: 0.5s;
	z-index: 1;
	backdrop-filter: blur(4px);

	&-leave-to,
	&-enter {
		background-color: transparent;
		backdrop-filter: none;
	}
}
</style>

