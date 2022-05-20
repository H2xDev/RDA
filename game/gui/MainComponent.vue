<template>
	<div class="gui">
		<component :is="uiComponent" />
		<Fade />
	</div>
</template>

<script>
import { statesComponents } from './states/index.ts';
import Fade from './fade/fade.vue';

export default {
	name: 'MainComponent',
	components: {
		...statesComponents,
		Fade,
	},
	props: {
		uiComponent: { type: String },
	}
}
</script>

<style lang="scss">
	@import './styles/main.scss';

	* { box-sizing: border-box };
</style>

<style lang="scss" scoped>
.gui {
	position: absolute;
	width: var(--resolution-x);
	height: var(--resolution-y);
	top: 50%;
	left: 50%;
	margin-left: calc(-0.5 * var(--resolution-x));
	margin-top: calc(-0.5 * var(--resolution-y));
	color: #fff;
	overflow: hidden;

	> * {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
	}

}
</style>
