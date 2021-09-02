<template>
	<div class="t-container">
		<el-container>
			<el-header height="auto">
				<el-form label-width="100px">
					<el-form-item label="用户名字：" >
						<el-input v-model="listModel.user_name"></el-input>
					</el-form-item>
					<el-form-item label="用户角色：">
						<el-select v-model='listModel.role_id' placeholder="请选择">
							<el-option :key="-1" label="请选择" :value="undefined"></el-option>
							<el-option :key="-2" label="未分配" value="0"></el-option>
							<el-option
								v-for="item in roleNameData"
								:key="item.role_id"
								:label="item.role_name"
								:value = 'item.role_id'
							>

							</el-option>
						</el-select>
					</el-form-item>
					<el-button @click="beginAdd">
						新增
					</el-button>
				</el-form>
			</el-header>
			<el-main>
				<el-table :data="list.list" stripe>
					<el-table-column label="#" width="50" type="index">

					</el-table-column>
					<el-table-column label="用户名" width="200">
						<template slot-scope="scope">
							<span>{{ scope.row.user_name }}</span>
						</template>
					</el-table-column>
					<el-table-column label="用户密码" width="200">
						<template slot-scope="scope">
							<el-popover
								placement="right"
								trigger="click"
							>
								<span>{{ scope.row.user_pwd }}</span>
								<el-button type="primary" icon="el-icon-view"  slot="reference">查看</el-button>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column label="角色" width="200">
						<template slot-scope="scope">
							<span>{{ scope.row.role_name }}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" min-width="350px">
						<template slot-scope="scope">
							<el-button type="primary" icon="el-icon-edit" @click="beginUpdate(scope.row)">编辑</el-button>
							<el-button icon="el-icon-delete" type="danger"  @click="remove(scope.row.user_name)">删除</el-button>
							<el-popover
								placement="right"
								trigger="click"
								title="- 角色分配 -"
							>
								<el-form label-width="100px" class="form-warpper">
									<el-form-item label="角色分配：">
										<el-select v-model='edit.model.role_id'>
											<el-option :key="-1" label="未分配" :value="0"></el-option>
											<el-option
												v-for="item in roleNameData"
												:key="item.role_id"
												:label="item.role_name"
												:value = 'item.role_id'
											>
											</el-option>
										</el-select>
										<el-button type="success" @click="updateRole">分配</el-button>
									</el-form-item>
								</el-form>
								<el-button type="info" @click="beginUpdateRole(scope.row)" slot="reference">角色分配</el-button>
							</el-popover>
						</template>
					</el-table-column>
				</el-table>
			</el-main>
			<el-footer>
				<el-pagination
					:total="list.total"
					:page-sizes="pageSizes"
					:page-size="5"
					layout="total, sizes, prev, pager, next, jumper"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
				>
				</el-pagination>
			</el-footer>
		</el-container>
		<el-dialog :visible.sync="edit.isEdit" title="用户编辑" :modal="false" width="450px">
			<el-form label-width="70px"  :model="edit.model" ref="form"   :rules="rules" status-icon>
				<el-form-item label="用户名称" prop="user_name">
					<el-input :disabled="!edit.type" v-model="edit.model.user_name"></el-input>
				</el-form-item>
				<el-form-item label="用户密码" prop="user_pwd">
					<el-input v-model="edit.model.user_pwd"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="edit.isEdit = false">取消</el-button>
				<el-button @click="save"  type="primary">确定</el-button>
			</div>
		</el-dialog>
	</div>

</template>

<script type="text/ecmascript-6">
        export default {
                name: 'User',
	        data() {
                        return {
                                edit: {
					isEdit: false,
	                                type: true,
                                        model: { user_name: '', user_pwd: '',role_id: '',role_name:'' }
                                },
	                        rules: {
					user_name: [
						{
                                                        validator: async  (rule, value, next) => {
                                                                console.log(await this.$http({ url: '/user/valid_name' , method: 'post',data: { user_name: value }}));
                                                                if(value.length === 0)
                                                                        next(new Error('* 用户名称不能为空'));
                                                                else if(value.length < 2 || value.length > 50)
                                                                        next(new Error('* 用户名称长度2 - 50'));
                                                                else if(this.type || await this.$http({ url: '/user/valid_name' , method: 'post',data: { user_name: value }}) === 1)
                                                                        next(new Error('* 用户名称已存在'));
                                                                else
                                                                        next();
                                                        },
                                                        trigger:'blur'
						},
					],
		                        user_pwd: [
                                                {
                                                        validator: (rule, value, next) => {
                                                                if(value.length === 0)
                                                                        next(new Error('* 用户密码不能为空'));
                                                                else if(value.length < 3 || value.length > 50)
                                                                        next(new Error('* 用户密码长度3 - 50个字符'));
                                                                else
                                                                        next();
                                                        },
                                                        trigger:'blur'
                                                },
		                        ]
	                        },
                                list: [],
	                        roleNameData: [],
	                        roleName:'',
                                pageSizes: [5,10,15,20,15,30],
	                        listModel: {user_name: '', role_id: undefined, begin: 0, pageSize: 5 },
                        }
	        },
                async created() {
			this.roleNameData = await this.$http({url: '/role/all'});
	        },
	        computed: {
                        tableData(){
                                let list = [...this.list.list];
                                list.forEach(item =>{
                                        this.roleNameData.forEach(item2 => {
						if(item.role_id === null){
                                                        item.role_name = '未分配';
                                                        return;
						}else if(item.role_id === item2.role_id){
                                                        item.role_name = item2.role_name;
                                                        return;
                                                }
                                        });
//                                        let i = this.roleNameData.findIndex(item2 => item2.role_id === item.role_id)
//                                        if(i !== -1) item.role_name = this.list.list[i].role_name;
//                                        else item.role_name = "无角色"
                                });
                                return list;
                        }
	        },
	        methods: {
                        // 更新查询列表
                        async _listUpdate() {
                                let list = await this.$http({ url: '/user/list', method: 'post',data: this.listModel });
                                this.list = list;

                        },
		        // 每页显示的个数
                        handleSizeChange(val){
				this.listModel.pageSize = val;
                        },
		        // 页数
                        handleCurrentChange(val){
                                this.listModel.begin = (val - 1) * 5;
                        },
		        // 删除用户
		        async remove(user_name) {
				await this.$confirm('确定要删除吗？','提示',{ type: 'warning' });
				await this.$http({ url:'/user/remove/' + user_name, method: 'post' });
				this.list.list.splice(this.list.list.findIndex(item => item.user_name === user_name),1);
				this.list.total = this.list.total -1;
				this.$message({ message: '删除成功！', type: 'success' });
		        },
		        // 开始添加
		        beginAdd() {
				this.edit.model.user_name = '';
				this.edit.model.user_pwd = '';
				this.edit.isEdit = true;
				this.edit.type = true;
		        },
		        // 开始修改
		        beginUpdate(user) {
                                this.edit.model.user_name = user.user_name;
                                this.edit.model.user_pwd = user.user_pwd;
                                this.edit.isEdit = true;
                                this.edit.type = false;
		        },
		        // 开始分配角色
                        beginUpdateRole(user) {
                                this.edit.model.role_name = user.role_name;
                                this.edit.model.user_name = user.user_name;
				this.edit.model.role_id = user.role_id;
				this.edit.model.user_pwd = user.user_pwd;
                        },
		        // 分配角色
		        async updateRole(){
				await this.$http({ url: '/user/config_role', method: 'post' ,data: {...this.edit.model}});
				this.list.list.splice(this.list.list.findIndex(item => item.user_name === this.edit.model.user_name),1,{...this.edit.model});
				this.$message({message: '分配成功！', type: 'success'})
		        },
		        // 保存修改用户密码和新增用户
		        async save(){
                                await this.$refs.form.validate();
                                if(this.edit.type){
                                        await this.$http({url: 'user/add', method: 'post',data: {...this.edit.model}});
                                        this.list.list.push({...this.edit.model});
                                        this.list.total = this.total + 1;
                                        this.$message({message: '用户添加成功！', type: 'success'});
                                }else{
					await this.$http({ url: '/user/change_pwd', method: 'post', data: {...this.edit.model} });
					this.list.list.splice(this.list.list.findIndex(item => item.user_name === this.edit.model.user_name),1,{ ...this.edit.model });
					this.$message({ message: '用户修改成功！',type: 'success' });
                                }
                                this.edit.isEdit = false;
		        }
	        },
                watch: {
                        // 监听页数渲染页面
                        listModel: {
                                handler: function(val) {
					this._listUpdate();
                                },
                                immediate: true,// 初始化时触发函数
                                deep: true // 当list_model中的值发生改变是触发函数
                        },


	        }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.form-warpper
		.el-form-item
			margin 0
	.t-container
		height 100%
	.el-container
		height 100%
		display flex
		flex-direction column
		overflow hidden
		.el-header
			flex-shrink 0
			.el-form
				.el-form-item
					display inline-block
					.el-input
						width 200px
		.el-main
			flex-grow 1
			overflow auto
		.el-footer
			flex-shrink 0
			display flex
			align-items center
</style>