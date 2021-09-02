export default{
        namespaced: true,
        state: {
                stfList: []
        },
        getters: {},
        mutations: {
                _init(state,list){
                        list.forEach(item => state.stfList.push(item));
                },
                add(state,stf){
                        state.stfList.push({...stf});
                },
                update(state,stf){
                        let i = state.stfList.findIndex(item => item.stf_id === stf.stf_id);
                        state.stfList.splice(i,1,{...stf});
                }
        },
        actions: {
                async stfInit({rootState,commit}){
                        let list = [];
                                let target = rootState.dicData.filter(item => item.dic_group_key === 'staff_category');
                                target.forEach(item => {
                                rootState.http({url: '/staff/listbycategory/' + item.dic_id})
                                        .then(data => {
                                                commit('_init',[...data]);
                                        });
                        });
                }
        }
}