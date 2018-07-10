<template>
	<www-page>
		<div class="row">
			<div class="small-12 columns">
				<h1>Another Page</h1>
				<p>This is page two!</p>
				<p><router-link to="/">go home</router-link></p>

				<form :action="actionUrl">
					<input placeholder="Enter Email Address" type="email" name="email">
					<input placeholder="Enter Email Address" type="password" name="password">
					<button type="submit" name="loginForm_submit" id="loginForm_submit">Sign in</button>
					<!-- <input type="hidden" name="currURL" value="https://dev-vm-01.kiva.org/page-two"> -->
					<input type="hidden" id="crumb" name="crumb" value="caae1ede91">
				</form>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import helloQuery from '@/graphql/query/hello.graphql';

export default {
	components: { WwwPage },
	inject: ['apollo'],
	metaInfo: {
		title: 'Page two'
	},
	data() {
		return {
			actionUrl: 'https://dev-vm-01.kiva.org/login/process?doneUrl=https%3A%2F%2Fdev-vm-01.kiva.org%2Fui-site-map'
		};
	},
	apollo: {
		query: helloQuery,
		preFetch: true,
	},
	// TODO: Remove after testing VUE-37
	created() {
		this.$showTipMsg('Show Message on Page Load', 'warning');
	}
};
</script>

<style lang="scss">
@import 'settings';
</style>
