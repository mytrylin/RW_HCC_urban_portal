<template lang="pug">
	section(:style="isFullWidth ? 'margin:0' : ''")
		.section(:class="{'section--isFull':isFullWidth}")
			.section__title(v-if="title")
				hr
				h1
					font-awesome-icon(
						style="margin-right:1rem;"
						v-if='icon'
						:icon='icon'
						fixed-width
					)
					| {{ title }}
				hr

			slot

</template>

<style lang="scss" scoped>

	section{
		margin: 2rem 0;
		width: 100%;
		z-index: 1;
		position: relative;
    text-align: center;
	}

	.section {
		position: relative;
		padding: 0 1rem;
		margin: 0 auto;
		max-width: $maxWidth;
		&__title{
			margin: 5rem 0;
			display: flex;
			align-items: center;
			h1,hr{
				color: $primary;
				border-color: $primary;
			}
			h1{
				flex-shrink: 0;
				margin: 0 1rem;
			}
			hr{
				flex:100%;
			}
		}
		&--isFull{
			margin: 0;
			padding: 0;
			max-width: 100%;
		}
	}

</style>

<script>
export default {
	name: 'sectionStyled',
	data:()=>({

	}),
	props:{
		title:{
			type: String
		},
		icon:{
			type: String
		},
		isFullWidth:{
			type: Boolean,
			default: false,
		}
	}
}
</script>
