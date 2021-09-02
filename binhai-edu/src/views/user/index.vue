<template>
	<el-container>
		<el-header>
			<el-form inline>
				<el-form-item label="用户名字：">
					<el-input v-model="search.user_name" @change="pagination.currentPage = 1;getUser();">

					</el-input>
				</el-form-item>
				<el-form-item label="用户角色：">
					<el-select v-model="search.role_id" @change="pagination.currentPage = 1;getUser();">
						<el-option :value="-1" label="- 请选择 -"></el-option>
						<el-option :value="0" label="- 无角色 -"></el-option>
						<el-option
							v-for="item in roleList"
							:key="item.role_id"
							:value="item.role_id"
							:label="item.role_name"
						></el-option>
					</el-select>
				</el-form-item>

			</el-form>
			<el-button type="primary" icon="el-icon-plus" @click="beginAdd">
				添加
			</el-button>
		</el-header>
		<el-main>
			<el-table :data="list" border stripe>
				<el-table-column type="index" label="#" align="center" width="70"></el-table-column>
				<el-table-column prop="user_name" label="用户名" width="200"></el-table-column>
				<el-table-column label="用户密码" width="150" align="center">
					<template slot-scope="{ row }">
						<el-popover placement="right" :content="row.user_pwd">
							<el-button slot="reference" type="text" icon="el-icon-view">查看</el-button>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column label="角色" width="200" align="center">
					<template slot-scope="{ row: { role_id } }">
						<el-tag :type="role_id ? 'success' : 'info'">
							{{ role_id ? roleList.find(item => item.role_id === role_id).role_name : '未分配' }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" min-width="350" fixed="right">
					<template slot-scope="{ row }">
						<el-button icon="el-icon-edit" type="primary" size="mini" @click="beginUpdate(row)">编辑</el-button>
						<el-button icon="el-icon-remove" type="danger" size="mini" @click="remove(row.user_name)">删除</el-button>
						<el-popover placement="right" @show="edit2.model.role_id = row.role_id || 0; edit2.model.user_name=row.user_name">
							<el-select v-model="edit2.model.role_id" @change="userRoleConfig();">
								<el-option label="- 无角色 -" :value="0"></el-option>
								<el-option
									v-for="item in roleList"
									:key="item.role_id"
									:label="item.role_name"
									:value="item.role_id"
								></el-option>
							</el-select>
							<el-button slot="reference" size="mini" type="success" icon="el-icon-s-tools">
								角色分配
							</el-button>
						</el-popover>
					</template>
				</el-table-column>
			</el-table>
		</el-main>
		<el-footer>
			<el-pagination
				background
				:total="pagination.total"
				:page-size.sync="pagination.pageSize"
				:page-sizes="[6,8,10,12,14,16]"
				:current-page.sync="pagination.currentPage"
				layout="prev, pager, next, jumper, ->, sizes, total"
				@current-change="getUser();"
				@size-change="pagination.currentPage = 1; getUser();"
			>

			</el-pagination>
		</el-footer>
		<el-dialog :visible.sync="edit.isEdit" title="用户编辑" width="600px">
			<el-form label-width="65px" ref="form" :model="edit.model" :rules="edit.rules" status-icon>
				<el-form-item label="用户名" prop="user_name">
					<el-input :disabled="!edit.type" v-model="edit.model.user_name"></el-input>
				</el-form-item>
				<el-form-item prop="user_pwd" label="密码">
					<el-input v-model="edit.model.user_pwd" ></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="edit.isEdit = false">取消</el-button>
				<el-button type="primary" @click="save">确认</el-button>
			</div>
		</el-dialog>
	</el-container>
</template>

<script type="text/ecmascript-6">
	import { createNamespacedHelpers } from 'vuex';
        let { mapActions, mapState } = createNamespacedHelpers('role');
        export default {
                name: 'User',
	        data() {
                        return {
                                edit: {
					isEdit: false,
	                                type: true,
	                                model: { user_name:'', user_pwd:'',role_id: -1,role_name: '' },
	                                rules: {
					        user_name: [
                                                        { required: true, message: '用户名不能为空', trigger: 'blur' },
                                                        { min: 3, max: 20, message: '用户名长度在 3 到 20个字符', trigger: 'blur' }
					        ],
		                                user_pwd: [
			                                { required: true, message: '用户密码不能为空', trigger: 'blur' },
			                                { min: 3, max: 20, message: '用户名长度在 3 到 20个字符', trigger: 'blur' }
		                                ]
	                                }
                                },
	                        edit2: {
					model: {role_id: 0, user_name: ''}
	                        },
                                search: { user_name: '', role_id: -1 },
	                        pagination: { total: 0, pageSize: 6, currentPage: 1 },
	                        list: [],  // 存放当前显示的用户数据
                        }
	        },
	        computed: {
		        ...mapState({ roleList: 'list' })
	        },
                created(){
                        this.init();
                        this.getUser();
                },
	        methods: {
		        ...mapActions(['init']),
                        async getUser() {
				let { total, list } = await this.$http({
					url: '/user/list',
					method: 'post',
					data: {
						...this.search,
						begin: this.pagination.pageSize* (this.pagination.currentPage - 1),
						pageSize: this.pagination.pageSize
					}
				});
				this.pagination.total = total;
				this.list = list;
                        },
		        async remove(user_name) {
				await this.$confirm(`你确定删除用户：“${user_name}”吗？`, '提示', { type: 'warning' });
				await this.$http({ url: '/user/remove/' + user_name, method: 'post' });
				let i = this.list.findIndex(item => item.user_name === user_name);
				this.list.splice(i,1);
				await this.$message({ message: `删除用户：“${user_name}”成功！`, type: 'success' });
		        },
		        beginAdd() {
                                this.$refs.form && this.$refs.form.resetFields();
		                this.edit.model = { user_name:'', user_pwd:'',role_id: '' };
		                this.edit.type = true;
				this.edit.isEdit = true;
		        },
		        beginUpdate(user) {
                                this.$refs.form && this.$refs.form.resetFields();
		                this.edit.model = {...user};
                                this.edit.type = false;
				this.edit.isEdit = true;

		        },
		        async save() {
				await this.$refs.form.validate();
				let isExist = false;
				if(this.edit.type){
				        isExist = await this.$http({ url: '/user/valid_name', method: 'post' ,data: {...this.edit.model}}) === 1;
				}
				if(isExist){
				        this.$message({ message: '用户名已占用！',type: 'warning' });
				        return;
				}
				await this.$http({ url:`/user/${this.edit.type ? 'add' : 'change_pwd'}`,method:'post',data: {...this.edit.model} });
				if(this.edit.type){
				        this.list.push({...this.edit.model});
				        this.pagination.total++;
				}else{
				        let i = this.list.findIndex(item => item.user_name === this.edit.model.user_name);
				        this.list.splice(i,1,{...this.edit.model})
				}
                                this.$message({
                                        message: this.edit.type ? '用户新增成功！' : '用户修改成功！',type:'success'}
                                );
                                this.edit.isEdit = false;
                        },
                        async userRoleConfig() {
                                await this.$http({url: '/user/config_role', method: 'post', data: {...this.edit2.model}});
                                let target = this.list.find(item => item.user_name === this.edit2.model.user_name);
                                target.role_id = this.edit2.model.role_id || null;
                                this.$message({message:`用户：${this.edit2.model.user_name}角色分配成功！`,type:'success'});
                        }
	        },

        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.el-container
		position absolute
		top 0
		left 0
		width 100%
		height 100%
		.el-header
			display flex
			justify-content space-between
			.el-button
				align-self flex-start
</style>