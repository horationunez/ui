<template>
	<kv-button @click.native="addToBasket"
		v-kv-track-event="['Lending', 'Add to basket', 'lend-button-click', loanId, 'true']"
		v-if="!loading"
	>
		<slot>Lend now</slot>
	</kv-button>
	<kv-button v-else class="adding-to-basket">
		<kv-loading-spinner />
		Adding to basket
	</kv-button>
</template>

<script>
import _forEach from 'lodash/forEach';
import numeral from 'numeral';
import addToBasketMutation from '@/graphql/mutation/addToBasket.graphql';
import loanCardBasketed from '@/graphql/query/loanCardBasketed.graphql';
import KvButton from '@/components/Kv/KvButton';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

export default {
	components: {
		KvButton,
		KvLoadingSpinner,
	},
	inject: ['apollo'],
	props: {
		loanId: {
			type: Number,
			default: null
		},
		price: {
			type: [Number, String],
			default: 25,
		},
	},
	data() {
		return {
			loading: false,
		};
	},
	methods: {
		addToBasket() {
			this.loading = true;
			this.apollo.mutate({
				mutation: addToBasketMutation,
				variables: {
					id: this.loanId,
					price: numeral(this.price).format('0.00'),
				},
			}).then(({ errors }) => {
				if (errors) {
					// Handle errors from adding to basket
					_forEach(errors, ({ message }) => {
						this.$showTipMsg(message, 'error');
					});
				} else {
					// If no errors, update the loan fundraising info
					return this.apollo.query({
						query: loanCardBasketed,
						variables: {
							id: this.loanId,
						},
						fetchPolicy: 'network-only',
					});
				}
			}).catch(() => {
				this.$showTipMsg('Failed to add loan. Please try again.', 'error');
			}).finally(() => {
				this.loading = false;
			});
		}
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.loading-spinner {
	width: 1.5rem;
	height: 1.5rem;
	vertical-align: middle;
	margin-right: 3px;
}

.lend-by-category-page .loading-spinner {
	width: 1.25rem;
	height: 1.25rem;
}

.loading-spinner /deep/ .line {
	background-color: $white;
}

.lend-by-category-page .adding-to-basket.button.smaller {
	font-size: 1rem;
}
</style>
