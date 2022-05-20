<template>
	<transition name="fade" @after-enter="onFaded" @after-leave="onUnfaded">
		<div class="fade fullsize">
	</transition>
</template>

<script>
export default {
	data: () => ({
		isFaded: false,
	})
}
</script>
