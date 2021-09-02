export default{
        namespaced: true,
        state: {
                list: [],
                isInit: false,

        },
        getters: {},
        mutations: {
                _init(state,list){ state.list = list; state.isInit = true },
                _add(state,clsr){
                        state.list.push(clsr);
                        console.log(clsr)
                },
                _remove(state,clsr_id){
                        let i = state.list.findIndex(item => item.clsr_id === clsr_id);
                        state.list.splice(i,1);
                },
                _update(state,clsr){
                        let i = state.list.findIndex(item => item.clsr_id === clsr.clsr_id);
                        state.list.splice(i,1,clsr);
                },
                beginOccupy(state,clsr_id){
                        let target = state.list.find(item => item.clsr_id === clsr_id);
                        target.clsr_occupy = 1;
                },
                endOccupy(state,clsr_id){
                        let target = state.list.find(item => item.clsr_id === clsr_id);
                        target.clsr_occupy = 0;
                }
        },
        actions: {
                async init({ state, rootState: { http }, commit }) {
                        if(state.isInit) return;
                        let list = await http({url: '/classroom/all'});
                        commit('_init', list);
                },
                async add({rootState: {http},commit},clsr) {
                        let i =  await http({url: '/classroom/add', method: 'post', data: {...clsr}});
                        clsr.clsr_id = i;
                        commit('_add',clsr);
                },
                async update({rootState: {http}, commit}, clsr){
                        await http({url: '/classroom/update',method: 'post',data: {...clsr}});
                        commit('_update', clsr);
                },
                async remove({rootState: { http },commit},clsr_id) {
                        await http({url: '/classroom/remove/'+clsr_id});
                        commit('_remove',clsr_id);
                },
        }
}