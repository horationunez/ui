import Vue from 'vue';
import RouteListing from '@/components/RouteListing';
import createRouter from '@/router';


describe('RouteListing.vue', () => {
	it('should render 2 labels', () => {
		const router = createRouter();
		const Constructor = Vue.extend(RouteListing);
		const vm = new Constructor({ router }).$mount();
		expect(vm.$el.querySelectorAll('label').length)
			.to.equal(2);
	});
});