export default {
        namespaced: true,
        state: {
                list: [],
                isInit: false // 标识角色信息有没有初始化

        },
        getters: {},
        mutations: {
                _init(state,list) { state.list = list ; state.isInit = true},
                _remove(state,id){
                        state.list.splice(state.list.findIndex(item => item.role_id === id),1);
                },
                _add(state,role){
                        state.list.push({...role});
                },
                _update(state,role){
                        state.list.splice(state.list.findIndex(item => item.role_id === role.role_id),1,{...role});
                }
        },
        actions: {
                async init({ state ,rootState: { http }, commit }) {
                        if(state.isInit) return;
                        let list = await http({ url:'/role/all' });
                        commit('_init', list);
                },
                async remove({ rootState: { http }, commit },role_id ){
                        await http({url: '/role/remove/' + role_id, method: 'post'});
                        commit('_remove',role_id)
                },
                async add({ rootState: { http }, commit }, role) {
                        role.role_id = await http({ url: '/role/add', method: 'post' , data: role});
                        commit('_add',role);
                },
                async update({ rootState: { http }, commit },role) {
                        await http({ url: '/role/update', method: 'post', data: role });
                        commit('_update',role);
                }
        }
};