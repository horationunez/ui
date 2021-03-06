<template>
	<div id="app">
		<router-view/>
		<vue-progress-bar/>
		<the-tip-message/>
	</div>
</template>

<script>
import TheTipMessage from '@/components/WwwFrame/TheTipMessage';

export default {
	name: 'App',
	props: {
		appConfig: { type: Object, default: () => {} }
	},
	components: {
		TheTipMessage
	},
	metaInfo() {
		return {
			title: 'Loans that change lives',
			titleTemplate: '%s | Kiva',
			/* eslint-disable global-require */
			meta: [
				// General Meta Tags
				{
					vmid: 'keywords',
					name: 'keywords',
					// eslint-disable-next-line max-len
					content: 'kiva, microfinance, microcredit, microloan, microlending, loan, africa, business, philanthropy, international development, projects, corporate giving, corporate philanthropy, donors, donating, donation, charity, social development, economic development, grassroots development, employee giving, poverty alleviation, economic investments, social investment, entrepreneur, entrepreneurs, social entrepreneurship, innovation, giving, give, gift, gifts'
				},
				{
					vmid: 'description',
					name: 'description',
					// eslint-disable-next-line max-len
					content: 'Make a loan to an entrepreneur across the globe for as little as $25. Kiva is the world\'s first online lending platform connecting online lenders to entrepreneurs across the globe.'
				}
			].concat(this.appConfig.enableFB ? [
				// Facebook Specific Tags
				// TODO: We should consider omitting these on protected pages
				{
					vmid: 'facebook_label',
					name: 'facebook_label',
					content: 'Kiva - Loans that change lives'
				},
				{
					vmid: 'fb:app_id',
					property: 'fb:app_id',
					content: this.appConfig.fbApplicationId
				}
			] : []).concat([
				// Open Graph Tags
				{ property: 'og:site_name', content: 'Kiva' },
				// eslint-disable-next-line max-len
				{ property: 'og:description', content: 'Support women, entrepreneurs, students and refugees around the world with as little as $25 on Kiva. 100% of your loans go to support borrowers.' },
				{ property: 'theme-color', content: '#4faf4e' },
				{ property: 'og:image', content: require('@/assets/images/kiva_k_cutout_new.jpg') },
				{ property: 'og:image:width', content: '196' },
				{ property: 'og:image:height', content: '106' },
			]).concat([
				// Microsoft Tile Tags
				{ name: 'application-name', content: 'Kiva' },
				{ name: 'msapplication-TileColor', content: '#4faf4e' },
				{
					name: 'msapplication-TileImage',
					content: require('@/assets/images/favicons/mstile-144x144.png')
				},
				{
					name: 'msapplication-square70x70logo',
					content: require('@/assets/images/favicons/mstile-70x70.png')
				},
				{
					name: 'msapplication-square150x150logo',
					content: require('@/assets/images/favicons/mstile-150x150.png')
				},
			]),
			link: [
				// apple icons
				{
					link: 'apple-touch-icon',
					href: require('@/assets/images/favicons/apple-touch-icon-120x120.png')
				},
				{
					link: 'apple-touch-icon',
					sizes: '152x152',
					href: require('@/assets/images/favicons/apple-touch-icon-152x152.png')
				},
			].concat([
				// Standard Favicons + Android favicons
				{
					rel: 'icon',
					type: 'image/x-icon',
					href: require('@/assets/images/favicons/favicon.ico'),
				},
				{
					rel: 'icon',
					type: 'image/x-icon',
					href: require('@/assets/images/favicons/favicon-16x16.png'),
					sizes: '16x16'
				},
				{
					rel: 'icon',
					type: 'image/x-icon',
					href: require('@/assets/images/favicons/favicon-32x32.png'),
					sizes: '32x32'
				},
				{
					rel: 'icon',
					type: 'image/x-icon',
					href: require('@/assets/images/favicons/favicon-96x96.png'),
					sizes: '96x96'
				},
				{
					rel: 'icon',
					type: 'image/x-icon',
					href: require('@/assets/images/favicons/favicon-128.png'),
					sizes: '128x128'
				},
				{
					rel: 'icon',
					type: 'image/x-icon',
					href: require('@/assets/images/favicons/favicon-196x196.png'),
					sizes: '196x196'
				},
			])
		};
	}
};
</script>

<style lang="scss">
// import all the variables
@import 'settings';
@import 'foundation';

// import fonts first to start loading them
@import 'global/fonts';

// import global foundation components
@include foundation-global-styles;
@include foundation-flex-classes;
@include foundation-flex-grid;
@include foundation-visibility-classes;
@include foundation-typography;
@include foundation-forms;

// import global styles
@import 'global/page-layout';
@import 'global/line-breaks';
@import 'global/typography';
@import 'global/forms';

#app {
	height: 100%;
}
</style>
