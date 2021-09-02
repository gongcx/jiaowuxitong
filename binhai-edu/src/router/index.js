import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../pages/home';
import Login from '../pages/login';
import { MessageBox } from 'element-ui';

Vue.use(VueRouter);
// 创建路由并导出

const router = new VueRouter({
        routes: [
                { path: '/', redirect: '/login' },
                { path: '/login', component: Login },
                { path: '/home', component: Home }
        ]
});

// router.beforeEach((to, from, next) => {
        // if(to.path === '/home' && !sessionStorage.getItem('name')){
        //         MessageBox.alert('您未登录或登录超时，请重新登录！','警告',{ type: 'warning', })
        //                 .then(() => {  next('/login')});
        // }
// });
export default router;

