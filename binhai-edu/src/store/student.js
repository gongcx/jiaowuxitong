export default {
        namespaced: true,
        state: {
                classList: []
        },
        getter: {

        },
        mutations: {
                _getClassList(state,list) {
                        state.classList = [...list];
                },
                addClass(state,cls){
                        state.classList.push({...cls});
                },
                updateClass(state,cls){
                        let i = state.classList.findIndex(item => item.cls_id === cls.cls_id);
                        state.classList.splice(i,1,{...cls});
                }
        },
        actions: {
                async getClassList({rootState: {http}, commit}) {
                        let list = await http({url: '/class/all'});
                        commit('_getClassList', list);
                }
        }
}