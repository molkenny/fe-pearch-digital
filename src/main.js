import Vue from 'vue';
import App from './App.vue';
import VueResource from 'vue-resource';
import Vuelidate from 'vuelidate';
import { router } from './router/routes';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import { store } from './store/store';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import vmodal from 'vue-js-modal';

//Bootstrap
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

//Resources
Vue.use(VueResource);

//Misc
Vue.use(Vuelidate);
Vue.use(VueSweetalert2);
Vue.use(vmodal);


//Vue.http.options.root = process.env.VUE_APP_BE_BASE_URL;
Vue.http.options.root = process.env.VUE_APP_BE_PRODUCTION;

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');