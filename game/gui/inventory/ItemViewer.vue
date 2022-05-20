<template>
	<transition name="bg-filter" mode="out-in">
		<div class="item-viewer fullsize bg-filter" v-if="value">
			<div class="card">
				<div class="item-viewer__icon">
					<img :src="value.sprite.image.src" height="100%">
				</div>

				<div class="item-viewer__content">
					<p class="item-viewer__title">
						{{ value.name }}
					</p>

					<p class="item-viewer__description">
						{{ value.description }}
					</p>
				</div>

				<div class="actions">
					<button class="button mr" v-if="value.equipable" @click="equip">Equip</button>
					<button class="button" @click="close">Close</button>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import { Item } from '../../entities/item'
import { InventoryService } from '../../services/inventory.service';

export default {
	name: 'ItemViewer',

	props: {
		/** @type { import('vue').PropType<Item> } */
		value: {
			type: null,
		}
	},

	methods: {
		close() {
			this.$emit('input', null);
		},
		equip() {
			this.close();
			InventoryService.close();
			InventoryService.player.equipItem(this.value);
			this.$root.setPause(false);
		}
	}
}
</script>

<style lang="scss" scoped>
.item-viewer {
	display: flex;
	align-items:center;
	justify-content: center;

	> .card {
		width: 300px;
		min-height: 200px;
		flex-direction: column;
	}

	&__title {
		font-size: 1.5em;
		margin-bottom: 10px;
	}

	&__icon {
		height: 64px;
		text-align: center;
	}

	&__content {
		flex: auto;
	}
}
</style>
