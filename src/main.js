import Vue from 'vue'
import App from './App.vue'
import router from './router'

import moment from 'moment'
import Breadcrumb from './components/customer/breadcrumb'

import ElementUI from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/styles/reset.css'
import httpPlugin from './plugins/httpPlugin';

Vue.use(ElementUI)
Vue.use(httpPlugin)
Vue.config.productionTip = false

// 全局组件
Vue.component('gqs-breadcrumb', Breadcrumb)
//全局过滤器
Vue.filter('fmtDate', v => {
  return moment(v).format('YYYY-MM-DD')
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
