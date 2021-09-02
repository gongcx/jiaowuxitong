export default {
        namespaced: true,
        state: {
                list: [
                        { staff_id: 1, staff_name: '员工1' },
                        { staff_id: 2, staff_name: '员工2' },
                        { staff_id: 3, staff_name: '员工3' },
                        { staff_id: 4, staff_name: '员工4' },
                        { staff_id: 5, staff_name: '员工5' },
                        { staff_id: 6, staff_name: '员工6' },
                ]
        },
        getter: {},
        mutations: {
                remove(state,staff_id){
                        state.list.splice(state.list.findIndex(item => item.staff_id === staff_id),1);
                },
                add(state,staff) {
                        staff.staff_id = state.list[state.list.length - 1].staff_id + 1;
                        state.list.push({...staff});
                },
                update(state,staff) {
                        state.list.splice(state.list.findIndex(item => item.staff_id === staff.staff_id),1,{...staff});
                }
        },
        actions: {
                
        }
}