import axios from 'axios';
import { MessageBox,Loading } from 'element-ui';
import router from '../router';
// =========
let loading;
function startLoading() {    //使用Element loading-start 方法
        loading = Loading.service({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
        })
}
function endLoading() {    //使用Element loading-close 方法
        loading.close()
}
// ========
function http(userOption){
        //请求数据拦截器
        axios.interceptors.request.use(request => {
                startLoading();
                return request
        }, err => {
                return Promise.reject(err);
        });

        userOption.method = userOption.method || 'get';
        userOption.headers = userOption.headers || {};
        userOption.headers.Authorization = sessionStorage.getItem('token');
        // 发送ajax
        return axios(userOption)
                .then(res =>{
                        if(res.status === 200){
                                endLoading();
                                let {status, data, message} = res.data;
                                switch(status){
                                        case 200:
                                                return data;
                                        case 401:
                                                sessionStorage.removeItem('token');
                                                sessionStorage.removeItem('name');
                                                router.push('/login');
                                                throw new Error('您未登录或登录超时，请重新登录！');
                                        case 404:
                                        case 500:
                                        case 199:
                                                throw new Error(message);
                                }
                        } else {
                                throw new Error(res.statusText);
                        }
                })
                .catch(error => {
                        MessageBox.alert(error.message,'警告',{ type: 'warning' });
                        return Promise.reject();
                });
}
export default http;