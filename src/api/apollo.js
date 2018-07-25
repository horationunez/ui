import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { IntrospectionFragmentMatcher, InMemoryCache } from 'apollo-cache-inmemory';
import HttpLinkCreator from './HttpLink';
import RequestLink from './RequestLink';
import StateLinkCreator from './StateLink';

export default function createApolloClient({
	cookie,
	csrfToken,
	types = [],
	uri,
}) {
	const cache = new InMemoryCache({
		fragmentMatcher: new IntrospectionFragmentMatcher({
			introspectionQueryResultData: {
				__schema: { types }
			}
		})
	});

	return new ApolloClient({
		link: ApolloLink.from([
			StateLinkCreator({ cache }),
			RequestLink({ cookie, csrfToken }),
			HttpLinkCreator({ cookie, uri }),
		]),
		cache,
		defaultOptions: {
			watchQuery: {
				errorPolicy: 'all',
			},
			query: {
				errorPolicy: 'all',
			},
			mutate: {
				errorPolicy: 'all',
			},
		}
	});
}
