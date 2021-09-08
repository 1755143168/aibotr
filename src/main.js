// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import './icons'
// import store from './store'
import buttonPermission from './utils/buttonPermission'
import promise from 'es6-promise'
promise.polyfill();

Vue.use(ElementUI);
// Vue.prototype.$video = Video
Vue.config.productionTip = false
Vue.prototype.$btnPerm  = buttonPermission;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
