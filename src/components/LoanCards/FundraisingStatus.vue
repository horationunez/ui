<template functional>
	<div>
		<div class="fundraising-meter progress">
			<span v-if="props.isFunded"
				class="meter"
				style="width: 100%;"></span>
			<span v-else
				class="meter"
				:style="{width: (props.percentRaised * 100) + '%'}"></span>
		</div>

		<div class="left-and-to-go-line">
			<span v-if="props.isExpiringSoon"
				class="loan-message">{{ props.expiringSoonMessage }}</span>
			<span v-if="props.isFunded">Funded</span>
			<span v-else>${{ props.amountLeft | numeral('0,0') }} to go</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@import 'settings';
	$loan-card-meter-height: rem-calc(8);

	.fundraising-meter {
		height: $loan-card-meter-height;
		width: 100%;
		margin: 0 0 rem-calc(8);
		border-radius: $loan-card-meter-height;
		background-color: $kiva-stroke-gray;

		.meter {
			border-radius: $loan-card-meter-height;
			background-color: $kiva-green;
			display: block;
			height: 100%;
		}
	}

	.left-and-to-go-line {
		height: $small-text-font-size;
		font-size: $small-text-font-size;
		line-height: $small-text-font-size;
		font-style: italic;
		font-weight: $button-font-weight;
		color: $kiva-green;
	}

	.loan-message {
		color: $kiva-text-dark;
	}
</style>
