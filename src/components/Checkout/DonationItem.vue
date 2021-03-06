<template>
	<div class="basket-donation-item row">
		<span class="small-3 medium-1">
			<span class="donation-icon">
				<kv-icon class="dedicate-heart" name="dedicate-heart" />
			</span>
		</span>
		<span class="small-9 medium-8">
			<div class="donation-info featured-text">
				Donation to Kiva
			</div>
			<div>
				<a
					class="small-text donation-help-text"
					@click.prevent="triggerDefaultLightbox">
					Help Kiva reach more borrowers around the world
				</a>
				<!-- This lightbox will be replaced with a Popper tip message. -->
				<kv-lightbox
					:visible="defaultLbVisible"
					@lightbox-closed="lightboxClosed">
					<h2 slot="title">How does Kiva use donations?</h2>
					<div>
						100% of every dollar you lend on Kiva goes directly to funding loans.
						We rely on small optional donations from you and others to keep Kiva running.
						Every $1 donated to Kiva makes $8 in loans possible around the world.
						Your donation will enable us to:
						<ul style="list-style-type: disc;">
							<li>Send expert staff to over 60 countries to vet and monitor loans and partners.</li>
							<li>Build and maintain a website that facilitates over $1 million in loans each week.</li>
							<li>Provide comprehensive customer support to thousands of lenders worldwide.</li>
							<li>Train and support hundreds of volunteers -- 4 for every 1 staff member at Kiva.</li>
						</ul>
						If you live in the United States, your donation is tax-deductible.
						Thank you for considering a donation to Kiva.
					</div>
				</kv-lightbox>
			</div>
		</span>
		<span class="small-3 show-for-small-only"></span>
		<span class="small-9 medium-3 featured-text">
			<span class="small-12 medium-6">
				<input
					type="input"
					class="donation-amount-input"
					name="donation"
					id="donation"
					v-model="amount">
			</span>
			<span class="small-12 medium-6">
				<kv-button
					class="secondary"
					@click.native.prevent.stop="updateDonation()"
				>Update</kv-button>
			</span>
		</span>
	</div>

</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import KvButton from '@/components/Kv/KvButton';
import KvLightbox from '@/components/Kv/KvLightbox';
import updateDonation from '@/graphql/mutation/updateDonation.graphql';

export default {
	components: {
		KvIcon,
		KvButton,
		KvLightbox
	},
	inject: ['apollo'],
	props: {
		donation: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			defaultLbVisible: false,
			amount: this.donation.price
		};
	},
	methods: {
		triggerDefaultLightbox() {
			this.defaultLbVisible = !this.defaultLbVisible;
		},
		lightboxClosed() {
			this.defaultLbVisible = false;
		},
		updateDonation() {
			this.apollo.mutate({
				mutation: updateDonation,
				variables: {
					price: this.amount,
					isTip: this.donation.isTip
				}
			}).then(() => {
				this.$emit('refreshtotals');
			}).catch(error => {
				console.error(error);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.basket-donation-item {
	padding-right: rem-calc(20);
}

.donation-icon {
	padding: 0;
}

.dedicate-heart {
	border: 1px solid $light-gray;
	height: rem-calc(55);
	width: rem-calc(55);
}

.donation-help-text {
	display: block;
	margin-bottom: rem-calc(15);
}

.donation-amount-input {
	border: 1px solid $light-gray;
	width: 100%;
	text-align: center;

	@include breakpoint(medium) {
		width: rem-calc(110);
	}
}

input {
	width: rem-calc(100);
	text-align: right;
	padding-right: rem-calc(5);
	height: rem-calc(50);
	margin-bottom: rem-calc(20);

	@include breakpoint(medium) {
		height: rem-calc(32);
	}
}

.basket-donation-item .secondary {
	color: $kiva-accent-blue;
	border: 1px solid $kiva-accent-blue;
	box-shadow: 0 1px $kiva-accent-blue;
	width: 100%;

	@include breakpoint(medium) {
		padding: rem-calc(6) rem-calc(20);
		margin-bottom: rem-calc(5);
		margin-left: rem-calc(10);
		width: inherit;
	}
}

</style>
