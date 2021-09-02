<template>
	<div>
		<el-row :gutter="20">
			<transition-group>
				<el-col :span="6" v-for="item in roleList" :key="item.role_id">
					<el-card>
						<span v-text="item.role_name"></span>
						<div class="btn-mask">
							<el-button class="btn-update" type="text" icon="el-icon-setting"@click="beginRoleConfig(item);roleConfig.isEdit = true;"></el-button>
							<el-button @click="beginUpdate(item)" type="text" class="btn-update"><i class="el-icon-edit"></i></el-button>
							<el-button @click="removeHandler(item)" type="text" class="btn-remove"><i class="el-icon-delete"></i></el-button>
						</div>
					</el-card>
				</el-col>
			</transition-group>

			<el-col :span="6">
				<el-card class="btn-add" @click.native="beginAdd()">
					<i class="el-icon-plus"></i>
				</el-card>
			</el-col>
		</el-row>
		<el-dialog :visible.sync="isEdit" title="角色编辑" width="800px" :modal="false">
			<el-form label-width="100px" :model="model" :rules="rules" status-icon ref="form">
				<el-form-item label="角色名称" prop="role_name">
					<el-input v-model.trim="model.role_name"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="isEdit = false">取消</el-button>
				<el-button type="primary" @click="save">确认</el-button>
			</div>
		</el-dialog>
		<el-drawer class="custom-drawer" :modal="false" title="- 角色功能分配 -" :visible.sync="roleConfig.isEdit">
			<el-tree :data="roleConfig.treeData" class="custom-tree" default-expand-all :expand-on-click-node="false">
				<span class="custom-tree-node" :class="{ parent: data.func_fid === 0 }" slot-scope="{ node, data }">
					<span v-text="data.func_name"></span>
					<el-switch
						v-model="data.checked"
						:active-value="true"
						:inactive-value="false"
						@change="checked => switchToggle(checked,data)"
					></el-switch>
				</span>
			</el-tree>
			<div class="btn-wrapper">
				<el-button type="primary" @click="saveConfig">确定</el-button>
				<el-button @click="resetFuncList">重置</el-button>
			</div>

		</el-drawer>
	</div>
</template>

<script type="text/ecmascript-6">
	import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';

        export default {
                name: 'Role',
	        data() {
                        return {
				isEdit: false,
	                        model: { role_id: 0, role_name: '' },
	                        type: true,
	                        rules: {
				        role_name: [
					        {
                                                        validator: (rule,value,next) => {
								if(value.length === 0)
								        next(new Error('* 角色名不能为空'));
	                                                        else if(value.length < 2 || value.length > 10)
	                                                                next(new Error('* 角色名长度2 - 10'));
	                                                        else if(this.$store.state.role.list.findIndex(item => item.role_name === value && item.role_id !== this.model.role_id) !== -1)
	                                                                next(new Error('* 角色名已存在'));
	                                                        else
	                                                                next();
                                                        }
					        }
				        ]
	                        },
	                        roleConfig: {
				        isEdit: false,
				        treeData: [],
		                        role_id: 0,
		                        roleFuncList: [],
	                        }
                        }
	        },
	        computed: {
		        ...mapState('role',{ roleList: 'list' }),
		        ...mapState('func',{ funcList: 'list' }),
	        },
	        async created(){
			await this.roleInit(); // 通知仓库准备角色列表数据
			await this.funcInit(); // 通知仓库准备功能列表数据
	        },
	        methods: {
		        ...mapActions('role',{ roleInit: 'init', addRole: 'add', removeRole: 'remove', updateRole: 'update' }),
		        ...mapActions('func',{ funcInit: 'init' }),
			async removeHandler(role){
                                await this.$confirm(`确认要删除角色：“${role.role_name}”吗？`,'提示',{ type: 'warning' });
//                                await this.$store.dispatch('role/remove',role.role_id);
                                this.removeRole(role.role_id);
                                this.$message({message:`角色："${role.role_name}"删除成功！`});
			},
		        beginAdd(){
                                this.$refs.form && this.$refs.form.resetFields();
			        this.type = true;
			        this.model.role_id = 0;
			        this.model.role_name = '';
			        this.isEdit = true;
		        },
		        beginUpdate(role){
                                this.$refs.form && this.$refs.form.resetFields();
                                this.type = false;
                                this.model.role_id = role.role_id;
                                this.model.role_name = role.role_name;
                                this.isEdit = true;
		        },
		        async save() {
		                await this.$refs.form.validate();
//                                await this.$store.dispatch(`role/${this.type ? 'add' : 'update'}`,this.model);
			        await this[this.type ? 'addRole' : 'updateRole'](this.model);
                                this.$message({
                                        message: this.type ? '角色新增成功！' : '角色修改成功！',type:'success'}
                                );
                                this.isEdit = false;
		        },
		        resetFuncList() {
				this.roleConfig.treeData.forEach(item => {
					item.checked = this.roleConfig.roleFuncList.some(func => func.func_id === item.func_id);
					item.children && item.children.forEach(item2 => {
					        item2.checked = this.roleConfig.roleFuncList.some(func => func.func_id === item2.func_id);
					});
				});
		        },
                       async  beginRoleConfig(role) {
				this.roleConfig.role_id = role.role_id;
				this.roleConfig.roleFuncList = await this.$http({ url: '/role_function/list/'+role.role_id });
				this.resetFuncList();
                        },
		        switchToggle(checked,func){
				 let targetFunc = this.roleConfig.treeData.find(item => item.func_id === func.func_id);
//				 如果点的是一级节点
			        if(func.func_fid === 0){
			                targetFunc.children.forEach(item => item.checked = checked);
			        }else{
			                let father = this.roleConfig.treeData.find(item => item.func_id === func.func_fid);
                                        father.checked = father.children.some(item => item.checked);
//			                if(checked){
//			                        father.checked = checked;
//			                }else{
//			                        father.checked = father.children.some(item => item.checked);
//			                }
			        }
		        },
		        async saveConfig() {
		                let ids = [];
		                this.roleConfig.treeData.forEach(item => {
		                        item.checked && ids.push(item.func_id);
                                        item.checked && item.children.forEach(item2 => item2.checked && ids.push(item2.func_id));
//                                        item.checked && ids.push(item.func_id) && item.children.forEach(item2 => item2.checked && ids.push(item2.func_id));
		                });
		                // 发送ajax
				await this.$http({ url: '/role_function/config' , method: 'post',
					data: { role_id: this.roleConfig.role_id, role_func_ids: ids.join(',') }});
				await this.$message({ message: '角色功能分配成功！', type: 'success' });
				this.roleConfig.isEdit = false;
		        }
	        },
	        watch: {
                        funcList: {
                                handler: function(newValue, oldValue){
                                        // 把roleConfig中的funcList重置清空
                                        this.roleConfig.treeData = [];
                                        // 用新的newValue来重新生成roleConfig中的treeData
                                        newValue.filter(item => item.func_fid === 0).forEach(item => {
						let node = {...item,checked: false};
						let children = newValue.filter(item2 => item2.func_fid === item.func_id);
						if(children.length > 0){
						        node.children = [];
						        children.forEach(item2 => node.children.push({...item2,checked: false}));
						}
						this.roleConfig.treeData.push(node);
                                        });
                                        // 退出当前角色分配功能状态
                                        this.roleConfig.isEdit = false;
                                },
                                immediate: true //进入组件就马上执行一次上面handler中的函数
                        }
                }
        }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.btn-wrapper
		display flex
		justify-content center
	.custom-drawer >>> .el-drawer__body
		overflow auto
	.el-tree
		margin 30px
		.custom-tree-node
			width: 100%
			display: flex
			justify-content: space-between
			align-items: center
			font-size: 16px
			&.parent
				padding-right 40px
	.el-col
		margin-bottom 20px
		&.v-enter-to,&.v-leave
			opacity 1
		&.v-enter,&.v-leave-to
			opacity 0
		&.v-enter-active,&.v-leave-active
			transition all 0.8s
		.el-card
			padding-bottom 50%
			position relative
			& >>> .el-card__body
				padding 0
				position absolute
				top 0
				left 0
				width 100%
				height 100%
				display flex
				justify-content center
				align-items center
				background-color #409EFF
			span
				color #fff
				font-size 20px
				font-weight 500
			&:hover .btn-mask
				display flex
			.btn-mask
				position absolute
				top 0
				left 0
				width 100%
				height 100%
				background-color rgba(0,0,0,0.7)
				display flex
				justify-content center
				align-items center
				display none
			.el-button
				color #fff
				font-size 34px
				font-weight 500
				margin 0 20px
			& >>> span:hover
				color #409EFF
			&.btn-add >>> .el-card__body
				border 1px dashed #409EFF
				background-color #fff
				color #409EFF
				font-weight bolder
				font-size 25px
				box-sizing border-box
				cursor pointer

</style>