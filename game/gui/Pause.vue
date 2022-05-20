<template>
	<transition name="bg-filter">
		<div v-show="$root.isPaused" class="pause fullsize bg-filter">
			<div class="pause__menu card">
				<p class="card__heading"> Pause </p>

				<button class="button" @click="$root.setPause(false)">
					Return
				</button>
				<button class="button" @click="openInvertory">
					Inventory
				</button>
				<button class="button" @click="openInvertory">
					Back to Menu
				</button>
			</div>

			<Inventory />
		</div>
	</transition>
</template>

<script>
import { InventoryService } from '../services/inventory.service'

export default {
	name: 'PauseView',
	watch: {
		'$root.isPaused'(state) {
			if (!state) {
				InventoryService.close();
			}
		}
	},
	components: {
		Inventory: InventoryService.Component,
	},
	methods: {
		openInvertory() {
			InventoryService.open();
		}
	}
}
</script>

<style lang="scss" scoped>
.pause {
	position: absolute;
	z-index: 1;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	padding: 20px;
	transition: 0.25s;
	display: flex;
	flex-direction: column;

	&__menu {
		margin: auto;
		width: max-content;
		align-items: flex-start;
		flex-direction: column;
	}
}
</style>
