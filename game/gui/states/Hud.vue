<template>
	<div class="hud">
		<Pause />

		<div class="hud__bottom">
			<div class="hud__energy-indicator card"></div>
			<div class="hud__ammo card">
				<div v-for="n in 4" :key="n"></div>
			</div>
		</div>
	</div>
</template>

<script>
import Pause from '../Pause.vue';

export default {
	name: 'Hud',
	components: {
		Pause,
	}
}
</script>

<style lang="scss" scoped>
.hud {
	flex-direction: column;
	justify-content: flex-end;
	padding: 20px;

	&__bottom {
		display: flex;
		width: max-content;
		margin: 0 auto;
		gap: 4px;
	}

	&__ammo,
	&__energy-indicator {
		color: #000;
		width: 100px;
		align-items: center;

		> div {
			height: 4px;
			flex: auto;
			background-color: #5af;
			border-radius: 1px;
		}
	}

	&__energy-indicator {
		width: 14px;

		&::before {
			content: '';
			width: 4px;
			height: 4px;
			background-color: #5af;
			border-radius: 1px;
		}
	}
}
</style>
