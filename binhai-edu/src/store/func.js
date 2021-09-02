export default {
        namespaced: true,
        state: {
                list: [],
                isInit: false,
        },
        // 仓库的计算属性（更好的为组件服务提供数据）
        getters: {
                treeData(state) {
                        let result = [{ func_id: 0, func_name: 'root', func_key: '', func_fid: -1, children: [] }];
                        state.list.filter(item => item.func_fid === 0).forEach(item =>{
                                let node = {...item};
                                let children = state.list.filter(item2 =>item2.func_fid === node.func_id);
                                if(children.length >0){
                                        node.children = [];
                                        children.forEach(item2 =>node.children.push({...item2}))
                                }
                                result[0].children.push(node);
                        });
                        return result;
                }
        },
        mutations: {
                _init(state,list) { state.list = list; state.isInit = true; },
                _add(state,func){ state.list.push({...func}); },
                _remove(state,func_id){
                        state.list.splice(state.list.findIndex(item => item.func_id === func_id),1);
                },
                _update(state,func){
                        state.list.splice(state.list.findIndex(item => item.func_id === func.func_id),1,{...func});
                }
        },
        actions: {
                async init({state, rootState: { http }, commit }){
                        if(state.isInit) return;
                        let list = await http({ url: '/function/all' });
                        commit('_init', list);
                },
                async add({ rootState: { http }, commit },func){
                        func.func_id = await http({ url: '/function/add',method: 'post', data: func });
                        commit('_add',func);
                },
                async update({ rootState: { http }, commit },func){
                        await http({ url: '/function/update', method: 'post', data: func });
                        commit('_update', func)
                },
                async remove({ rootState: { http }, commit },func_id){
                        await http({ url: '/function/remove/' + func_id, method: 'post' });
                        commit('_remove', func_id);
                }
        }
}