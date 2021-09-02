import Vue from 'vue';
import App from './App.vue';// 导入
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/reset.css';
import './assets/public.css';
import store from './store'
import http from './utils/http.js';
Vue.use(ElementUI);
Vue.prototype.$http = http;
// 创建根实例并挂载
new Vue({
        el: '#app',
        router,
        store,
        components: { App }, // 注册
        template: '<App></App>', // 使用
});