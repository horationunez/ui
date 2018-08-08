import { withClientState } from 'apollo-link-state';

function setTestArray() {
	return [
		{ id: 3, name: 'matt', __typename: 'Entry' },
		{ id: 2, name: 'ghost', __typename: 'Entry' }
	];
}

export default ({ cache }) => {
	return withClientState({
		cache,
		defaults: {
			usingTouch: false,
			tipMsg: '',
			tipMsgType: 'info',
			tipVisible: false,
			tipPersist: false,
			tipInitUrl: '',
			testArray: setTestArray()
		},
		resolvers: {
			Mutation: {
				updateUsingTouch(_, { usingTouch }, context) {
					context.cache.writeData({
						data: { usingTouch }
					});
					return null;
				},
				updateTipMessage(_, {
					tipMsg,
					tipMsgType,
					tipVisible,
					tipPersist,
					tipInitUrl
				}, context) {
					context.cache.writeData({
						data: {
							tipMsg,
							tipMsgType,
							tipVisible,
							tipPersist,
							tipInitUrl
						}
					});
					return null;
				}
			}
		},
	});
};
