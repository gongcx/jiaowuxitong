export default {
        // namespaced 节点设置为true，可以将当前子节点仓库中的
        // getters、mutations、actions中的内容与其他子仓库隔离开来，
        // 就算名字相同也不会冲突
        namespaced: true,
        state: {
                menu: [],
                tabs: [],
                activeTab: '',
        },
        getters: {},
        // 只有mutations节点中的方法，可以修改state中的数据
        // mutations中的方法只能是同步代码，不可以包含异步代码
        // mutations中的方法的第一个参数默认总是state
        mutations: {
                _init(state,menu) { state.menu = menu; },
                tabAdd(state,index) {
                        state.tabs.indexOf(index) === -1 && state.tabs.push(index);
                        state.activeTab = index;
                },
                tabRemove(state,name) {
                        state.tabs.splice(state.tabs.indexOf(name),1);
                        if(name === state.activeTab) {
                                state.activeTab = state.tabs[0] || '';
                        }
                },
                tabToggle(state,name){
                        state.activeTab = name;
                }
        },
        // vuex仓库规定,actions中的方法可以包含异步耗时的代码，但不能修改state中的数据
        actions: {
                async init({ rootState, commit }){
                        let menu = await rootState.http({url: '/user/getmenu',method: 'post'});
                        commit('_init',menu);
                }
        }
};