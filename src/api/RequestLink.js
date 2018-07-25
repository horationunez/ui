import { ApolloLink } from 'apollo-link';

// eslint-disable-next-line
export default ({ cookie, csrfToken }) => {
	return new ApolloLink((operation, forward) => {
		console.log(cookie);
		console.log(`Current Token: ${csrfToken}`);

		const allCookies = cookie || '';
		let cookiesSub = allCookies.substr(allCookies.indexOf('kv=') + 3);
		// only trim if this is not the last cookie
		const cutoff = cookiesSub.indexOf(';');
		if (cutoff !== -1) {
			cookiesSub = cookiesSub.substring(0, cutoff);
		}
		console.log(`processed cookieSub: ${cookiesSub}`);

		// eslint-disable-next-line
		operation.setContext(({ headers }) => {
			return {
				headers: {
				// eslint-disable-next-line
				'x-crumb': csrfToken || ''
				}
			};
		});

		return forward(operation);
	});
};
