<template>
	<div id="counter">
		<div>
			<Transition name="count">
				<h2 ref="number" :key="number">{{ number }}</h2>
			</Transition>
		</div>
		<h2>{{ number }}</h2>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from "vue";

	export default defineComponent({
		name: 'Counter',

		props: {
			number: Number
		}
	})
</script>

<style scoped lang="scss">
	@use 'variables' as v;

	#counter {
		width: fit-content;

		div,
		div>h2 {
			position: absolute;
		}

		>h2 {
			visibility: hidden;
		}
	}

	.count-enter-active,
	.count-leave-active {
		transition-property: all;
		transition-duration: 0.4s;
	}

	.count-enter-active {
		transition-delay: 0.05s;
	}

	.count-enter-from {
		opacity: 0;
		transform: translateY(1em);
	}

	.count-leave-to {
		opacity: 0;
		transform: translateY(-1em);
	}
</style>