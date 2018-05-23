/* eslint-disable no-underscore-dangle */
import 'babel-polyfill';
import _dropWhile from 'lodash/dropWhile';
import cookie from 'js-cookie';
import createAsyncCaller from '@/util/callAsyncData';
import createApp from '@/main';
import '@/assets/iconLoader';

const config = window.__KV_CONFIG__ || {};

// Set webpack public asset path based on configuration
__webpack_public_path__ = config.publicPath || '/'; // eslint-disable-line

// Create the App instance
const {
	app,
	router,
	store,
	apolloClient,
} = createApp({
	appConfig: config,
	apollo: {
		uri: config.graphqlUri,
		csrfToken: cookie.get('kvis') && cookie.get('kvis').substr(6),
		types: config.graphqlFragmentTypes,
	}
});

// Apply Server state to Client Store
if (window.__INITIAL_STATE__) {
	store.replaceState(window.__INITIAL_STATE__);
}
if (window.__APOLLO_STATE__) {
	apolloClient.cache.restore(window.__APOLLO_STATE__);
}

// setup global analytics data
app.$setKvAnalyticsData(app);
// fire server rendered pageview
app.$fireServerPageView();
// Add browser info to the store
store.dispatch('detectBrowserAbility');

// Wait until router has resolved all async before hooks and async components
router.onReady(() => {
	// Add router hook for handling asyncData.
	// Doing it after initial route is resolved so that we don't double-fetch
	// the data that we already have. Using router.beforeResolve() so that all
	// async components are resolved.
	router.beforeResolve((to, from, next) => {
		// get newly activated components
		const matched = router.getMatchedComponents(to);
		const prevMatched = router.getMatchedComponents(from);
		const activated = _dropWhile(matched, (c, i) => prevMatched[i] === c);

		// recursively call asyncData on activated components and their child components
		const callAsyncData = createAsyncCaller({ store, route: to });
		Promise.all(activated.map(callAsyncData)).then(next).catch(next);
	});

	router.beforeEach((to, from, next) => {
		app.$Progress.start(6500);

		// if no routes match our path, force a page refresh to that path
		const matched = router.getMatchedComponents(to);
		if (!matched.length) {
			window.location = to.fullPath;
		} else {
			next();
		}
	});

	router.afterEach((to, from) => {
		// finish loading
		app.$Progress.finish();
		// fire pageview
		app.$fireAsyncPageView(to, from);
	});

	router.onError(() => app.$Progress.fail());

	// Mount app in DOM
	app.$mount('#app');
});
