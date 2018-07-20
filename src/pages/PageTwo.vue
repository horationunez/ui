<template>
	<www-page>
		<div class="row">
			<div class="small-12 columns">
				<h1>Another Page</h1>
				<p>This is page two!</p>
				<p><router-link to="/">go home</router-link></p>

				<form
					v-show="!loading && !userId"
					ref="loginForm"
					name="loginForm"
					:action="actionUrl"
					@submit.prevent.stop="doLogin">
					<input placeholder="Enter Email Address" type="email" name="email">
					<input placeholder="Enter password" type="password" name="password">
					<button type="submit" name="loginForm_submit" id="loginForm_submit">Sign in</button>
					<input type="hidden" name="currURL" :value="currUrl">
					<!-- Have to pass this crumb in the Header and in the Request -->
					<input type="hidden" id="crumb" name="crumb" :value="crumb">
				</form>

				<i v-show="loading">Authenticating...</i>

				<h3 v-if="userId">Currently Logged In</h3>
			</div>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import WwwPage from '@/components/WwwFrame/WwwPage';
// import helloQuery from '@/graphql/query/hello.graphql';
import analyticsData from '@/graphql/query/analyticsData.graphql';

export default {
	components: { WwwPage },
	inject: ['apollo'],
	metaInfo: {
		title: 'Page two'
	},
	data() {
		return {
			/* eslint-disable max-len */
			// doneUrl works when applied to actionUrl...but isn't really useful
			// - when POSTing via ajax the doneUrl/currUrl page is loaded and returned in the response
			// ?doneUrl=https%3A%2F%2Fdev-vm-01.kiva.org%2Fui-site-map
			actionUrl: 'https://dev-vm-01.kiva.org/login/process',
			// Done url isn't working from currUrl ?doneUrl=https%3A%2F%2Fdev-vm-01.kiva.org%2Fui-site-map
			currUrl: 'https://dev-vm-01.kiva.org/page-two',
			crumb: '',
			userId: null,
			loading: false
		};
	},
	apollo: {
		query: analyticsData,
		preFetch: true,
		result({ data }) {
			this.userId = _get(data, 'my.userAccount.id');
		}
	},
	mounted() {
		this.crumb = this.getCookieCrumb();
	},
	methods: {
		getCookieCrumb() {
			const allCookies = document.cookie;
			let cookiesSub = allCookies.substr(allCookies.indexOf('kvis=') + 5);
			// only trim if this is not the last cookie
			const cutoff = cookiesSub.indexOf(';');
			if (cutoff !== -1) {
				cookiesSub = cookiesSub.substring(0, cutoff);
			}
			cookiesSub = cookiesSub.replace('crumb%3D', '');
			return cookiesSub;
		},
		doLogin() {
			this.loading = true;
			const formData = new FormData(this.$refs.loginForm);
			// console.log(formData);

			// expand the elements from the .entries() iterator into an actual array
			const parameters = [...formData.entries()]
				// transform the elements into encoded key-value-pairs
				.map(e => `${encodeURIComponent(e[0])}=${encodeURIComponent(e[1])}`);

			fetch(this.actionUrl, {
				method: 'POST',
				mode: 'cors', // no-cors, cors, *same-origin
				cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
				credentials: 'same-origin', // include, same-origin, *omit
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					// Not really needed
					// HTTP_X_CRUMB: this.crumb
				},
				redirect: 'follow', // manual, *follow, error
				referrer: 'no-referrer', // no-referrer, *client
				body: parameters.join('&')
			})
				.then(response => {
					// The response will be the doneUrl if passed or the current url
					console.log(response);

					// The Following $router changes don't work
					// - pushing to current path does nothing
					// this.$router.push({ path: this.$route.path });
					// - pushing to differenly ui server path navigates but doesn't update login state
					// this.$router.replace({ path: '/ui-site-map' });

					// Also tried running a query for header data but server sent cookies aren't set
					// yet so it doesn't return authenticated data

					// This works
					window.location = window.location;
				})
				.catch(error => console.error('Fetch Error =\n', error));
		},
	}
};
</script>

<style lang="scss">
@import 'settings';
</style>
