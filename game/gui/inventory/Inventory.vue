<template>
	<transition name="bg-filter" mode="out-in">
		<div class="inventory fullsize bg-filter" v-show="isOpened">
			<div class="card inventory__card">
				<p>Inventory</p>
				<div class="inventory__grid">
					<button
						v-for="(item, i) in itemList"
			 			class="inventory__item button"
						:key="i"
			 			@click="viewItem(item)"
					>
						<img v-if="item && item.sprite" :src="item.sprite.image.src" alt="">
					</button>
				</div>
				<div class="inventory__actions actions">
					<button class="button" @click="isOpened = false">
						Close
					</button>
				</div>
			</div>

			<ItemViewer v-model="currentItem" />
		</div>
	</transition>
</template>

<script>
import { InventoryService } from '../../services/inventory.service';
import ItemViewer from './ItemViewer.vue';

export default {
	name: 'Inventory',

	components: {
		ItemViewer,
	},

	data: () => ({
		capacity: 15,
		hItem: -1,
		isOpened: false,
		items: [],
		currentItem: undefined,
	}),

	computed: {
		itemList() {
			const { items, capacity } = this;
			const a = Array
				.from({ length: capacity });

			return [...items, ...a].slice(0, capacity);
		}
	},

	created() {
		InventoryService.setGUIElement(this);
	},

	methods: {
		viewItem(item) {
			this.currentItem = item;
		},

		closeItem() {
			this.currentItem = undefined;
		}
	}
};
</script>

<style lang="scss" scoped>
.inventory {
	display: flex;
	color: #000;
	align-items: center;
	justify-content: center;
	z-index: 1;

	p { margin: 0; }

	&__card {
		flex-direction: column;
		width: max-content;
		height: max-content;
	}

	&__grid {
		display: grid;
		grid-template-columns: repeat(5, 32px);
		grid-auto-rows: 32px;
		grid-gap: 2px;
	}

	&__item {
		background-color: rgba(#000, .9);
		// transition: .5s cubic-bezier(0,.76,.22,1.25);
		padding: 0;
		image-rendering: pixelated;
	}
}
</style>
