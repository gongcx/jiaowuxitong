import Vue from 'vue';
import Vuex from 'vuex';
import home from './home.js';
import role from './role.js';
import staff from './staff.js';
import func from './func.js';
import  http from '../utils/http.js';
import classroom from './classroom.js';
import student from './student.js';
import classStore from './classStore.js';

import User from '../views/user';
import Role from '../views/role';
import Func from '../views/func';
import Staff from '../views/staff';
import Classroom from '../views/classroom';
import Class from '../views/class';
import Student from '../views/student';
import Password from '../views/password';

Vue.use(Vuex);

const store = new Vuex.Store({
        // modules将仓库进行划分子仓库
        modules: { home, role, staff, func,classroom,student,classStore},
        // state节点主要放想存在仓库中的数据
        state: {
                http,
                funcsMap: {
                        User: { component: User, remark: '系统用户管理及用户角色分配' },
                        Role: { component: Role, remark: '系统角色管理及角色功能分配' },
                        Func: { component: Func, remark: '系统功能管理及角色功能管理' },
                        Classroom: { component: Classroom, remark: '教室管理' },
                        Class: { component: Class, remark: '班级管理' },
                        Staff: { component: Staff, remark: '人员管理' },
                        Student: { component: Student, remark: '学生管理' },
                        Password: { component: Password, remark: '密码管理' }
                },
                dicData: [],
                isDicData: false
        },
        getters: {},
        mutations: {
                _getDic(state,list){ state.dicData = list; state.isDicData = true; }
        },
        actions: {
                async getDic({state,commit}){
                        if(state.isDicData) return;
                        let list = await state.http({url: '/dictionary/all'});
                        commit('_getDic',list);
                }
        }
});

export default store;