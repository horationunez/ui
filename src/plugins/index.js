import apolloMixin from './apollo-mixin';
import kebabCaseFilter from './kebab-case-filter';
import numeralFilter from './numeral-filter';
import kvAnayltics from './kv-analytics-plugin';

export default {
	install: Vue => {
		Vue.mixin(apolloMixin);
		Vue.filter('kebabCase', kebabCaseFilter);
		Vue.filter('numeral', numeralFilter);
		kvAnayltics(Vue);
	}
};
