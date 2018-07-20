<template>
	<div v-html="content"></div>
</template>

<script>
import _get from 'lodash/get';
import _throttle from 'lodash/throttle';
import numeral from 'numeral';
import appealBannerQuery from '@/graphql/query/appealBanner.graphql';
import { expand, collapse } from '@/util/expander';

let accordionControl;
let accordionBody;
let amountButtons;
let otherButton;
let customInput;
let customSubmit;

let trackEvent = () => {};
let goToDonate = () => {};
let accordionToggled = () => {};
let onScroll = () => {};

const inactiveClass = 'inactive';

function setExpanded(expanded) {
	accordionControl.setAttribute('aria-expanded', expanded ? 'true' : 'false');
	accordionBody.setAttribute('aria-hidden', expanded ? 'false' : 'true');
}

function handleAccordionControlClick() {
	const expanded = accordionControl.getAttribute('aria-expanded') !== 'false';

	if (expanded) {
		collapse(accordionBody, { done: () => setExpanded(false) });
	} else {
		expand(accordionBody, { done: () => setExpanded(true) });
	}

	accordionToggled(!expanded);
}

function handleAmountButtonClick({ target }) {
	const amount = target.getAttribute('value');
	trackEvent('promo', 'click', 'EOYBanner', amount);
	goToDonate(amount);
}

function handleCustomInputFocus() {
	if (customInput.value === '') {
		customInput.value = '$';
	}
}

function handleCustomInputBlur() {
	if (customInput.value === '$') {
		customInput.value = '';
	}
}

function handleCustomInputKeyup() {
	if (customInput.value === '' || customInput.value === '$') {
		customSubmit.classList.add(inactiveClass);
	} else {
		customSubmit.classList.remove(inactiveClass);
	}
}

function handleCustomSubmitClick() {
	if (!customSubmit.classList.contains(inactiveClass)) {
		const amount = numeral(customInput.value).value();
		trackEvent('promo', 'clickOther', 'EOYBanner', amount);
		goToDonate(amount);
	}
}

// This allows us to add/remove the same event handler, but change what happens later by
// re-assigning onScroll.
function handleWindowScroll() {
	onScroll();
}

export default {
	data() {
		return {
			content: '<div></div>',
		};
	},
	inject: ['apollo'],
	apollo: {
		query: appealBannerQuery,
		preFetch: true,
		result({ data }) {
			try {
				this.content = JSON.parse(_get(data, 'general.content'));
			} catch (e) {
				// do nothing
			}
			// TODO: setExpanded() with !IsAppealBannerShrunk from session
		},
	},
	methods: {
		selectElements() {
			accordionControl = this.$el.querySelector('[aria-controls="ac-sitewide-appeal"]');
			accordionBody = this.$el.querySelector('#ac-sitewide-appeal');
			amountButtons = this.$el.querySelectorAll('.fixed-amount.button');
			otherButton = this.$el.querySelector('.other-amount');
			customInput = this.$el.querySelector('#sitewide-custom-amount');
			customSubmit = this.$el.querySelector('.custom-submit');
		},
		attachEvents() {
			accordionControl.addEventListener('click', handleAccordionControlClick);
			amountButtons.forEach(amountButton => {
				amountButton.addEventListener('click', handleAmountButtonClick);
			});
			otherButton.addEventListener('click', handleAmountButtonClick);
			customInput.addEventListener('focus', handleCustomInputFocus);
			customInput.addEventListener('blur', handleCustomInputBlur);
			customInput.addEventListener('keyup', handleCustomInputKeyup);
			customSubmit.addEventListener('click', handleCustomSubmitClick);
			window.addEventListener('scroll', handleWindowScroll);
		},
		removeEvents() {
			accordionControl.removeEventListener('click', handleAccordionControlClick);
			amountButtons.forEach(amountButton => {
				amountButton.removeEventListener('click', handleAmountButtonClick);
			});
			otherButton.removeEventListener('click', handleAmountButtonClick);
			customInput.removeEventListener('focus', handleCustomInputFocus);
			customInput.removeEventListener('blur', handleCustomInputBlur);
			customInput.removeEventListener('keyup', handleCustomInputKeyup);
			customSubmit.removeEventListener('click', handleCustomSubmitClick);
			window.addEventListener('scroll', handleWindowScroll);
		},
		saveExpandedPref(expanded) {
			console.log(`going to save ${expanded ? 'un' : ''}shrunk`);
			// TODO: save IsAppealBannerShrunk to session
		},
	},
	created() {
		trackEvent = this.$trackEvent;

		goToDonate = amount => {
			if (amount) {
				this.$router.push({
					path: '/donate/supportusprocess',
					query: {
						donationAmount: amount,
						src: 'email',
					},
				});
			} else {
				this.$router.push('/donate/supportus');
			}
		};

		accordionToggled = expanded => {
			this.saveExpandedPref(expanded);
		};

		// If a user scrolls past the sitewide appeal on a mobile device, we want it to default
		// to the closed state on any subsequent pages they visit. Makes for a nicer UX since
		// the banner takes up a ton of real estate on mobile
		onScroll = _throttle(() => {
			const { bottom } = accordionBody.getBoundingClientRect();
			if (bottom < 0 && window.innerWidth <= 480) {
				this.saveExpandedPref(false);
			}
		}, 200);
	},
	mounted() {
		this.selectElements();
		this.attachEvents();
	},
	beforeUpdate() {
		this.removeEvents();
	},
	updated() {
		this.selectElements();
		this.attachEvents();
	},
	beforeDestroy() {
		this.removeEvents();
	},
};
</script>

<style lang="scss">
@import 'settings';

.sitewide-appeal-wrapper {
	$spacing: rem-calc(10);
	$avatar-size: rem-calc(120);
	background-color: $kiva-alert-yellow;

	.sitewide-appeal {
		padding: 0 $spacing;
	}

	.sitewide-header {
		width: 100%;

		h2 {
			margin: 0;
			line-height: 1.75;
			display: flex;
			align-items: stretch;
			justify-content: space-between;
		}

		.dropdown-icon {
			padding-left: $spacing;
			display: flex;
			align-items: center;
		}

		.icon-large-chevron {
			height: rem-calc(25);
			width: rem-calc(25);
			transform: rotate(180deg);
			// transition: transform 300ms ease;
		}

		&[aria-expanded="false"] .icon-large-chevron {
			transform: rotate(0deg);
		}

		@include breakpoint(xlarge) {
			margin-left: $avatar-size + $spacing;
		}
	}

	.sitewide-body {
		display: flex;
		flex-flow: row wrap;
		overflow: hidden;

		&[aria-hidden="true"] {
			height: 0;
		}
	}

	.circle-avatar {
		border-radius: 50%;
		width: $avatar-size;
		height: $avatar-size;
		margin: 0 $spacing $spacing 0;
		display: none;

		@include breakpoint(medium) {
			display: block;
		}
	}

	.message {
		flex-basis: 100%;

		@include breakpoint(medium) {
			flex-basis: calc(100% - #{$avatar-size + $spacing});
		}

		div {
			margin-bottom: $spacing;
		}
	}

	.donation-buttons {
		flex-basis: 100%;

		@include breakpoint(xlarge) {
			margin-left: $avatar-size + $spacing;
		}

		ul {
			display: flex;
			flex-flow: row wrap;
			justify-content: space-between;
			align-items: center;
			margin: 0;
		}

		li {
			flex-basis: calc(50% - #{$spacing});
			list-style: none;

			@include breakpoint(medium) {
				flex-basis: calc(20% - #{$spacing});
			}

			&.show-for-medium-up {
				display: none;

				@include breakpoint(medium) {
					display: block;
				}
			}

			.button {
				padding-left: 0;
				padding-right: 0;
			}

			& > * {
				width: 100%;
			}
		}
	}

	.custom-amount input,
	.custom-submit {
		font-size: 1.25rem;
	}

	.custom-submit {
		&.inactive,
		&.inactive:hover,
		&.inactive:focus {
			border-color: $kiva-text-light;
			color: $kiva-text-light;
		}
	}
}
</style>
