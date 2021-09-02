<template>
	<div>
		<el-tree class="custom-tree" :data="$store.getters['func/treeData']" default-expand-all :expand-on-click-node="false">
			<span class="custom-tree-node" slot-scope="{ node, data }">
				<span v-text="data.func_name"></span>
				<span>
					<el-button type="text" v-if=" data.func_key === '' " @click="beginAdd(data)">
						<i class="el-icon-plus"></i>
					</el-button>
					<el-button @click="beginUpdate(data)" type="text" v-if="[0,1,2].indexOf(data.func_id) === -1">
						<i class="el-icon-edit"></i>
					</el-button>
					<el-button @click="beginRemove(data)" type="text" v-if="[0,1,2].indexOf(data.func_id) === -1" :disabled="'children' in data">
						<i class="el-icon-delete"></i>
					</el-button>
				</span>
			</span>
		</el-tree>
		<el-dialog :visible.sync="isEdit" title="功能编辑" :modal="false">
			<el-form label-width="80px" :model="model" ref="form"   :rules="rules" status-icon>
				<el-form-item label="父节点">
					<span v-text="fatherName"></span>
				</el-form-item>
				<el-form-item label="节点类型">
					<el-radio v-model="isLeaf" :label="false" :disabled="(!type) || model.func_fid !== 0">非叶子</el-radio>
					<el-radio v-model="isLeaf" :label="true" :disabled="(!type) || model.func_fid !== 0">叶子</el-radio>
				</el-form-item>
				<el-form-item label="功能名称" prop="func_name">
					<el-input v-model.trim="model.func_name"></el-input>
				</el-form-item>
				<el-form-item label="功能绑定" v-show="isLeaf" prop="func_key">
					<el-select v-model="model.func_key">
						<el-option
							v-for="(item,key) in $store.state.funcsMap"
							:key="key"
							:value="key"
							:disabled="$store.state.func.list.some(func => func.func_key === key)"
						>
							<el-popover :content="$store.state.funcsMap[key].remark" trigger="hover" placement="right">
								<span v-text="key" slot="reference"></span>
							</el-popover>
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="isEdit = false">取消</el-button>
				<el-button type="primary" @click="save">确认</el-button>
			</div>
		</el-dialog>
	</div>

</template>

<script type="text/ecmascript-6">
	let id = 1000;
        export default {
                name: 'Func',
	        data() {
                        return {
				isEdit: false,
	                        type: true,
	                        model: { func_id: 0, func_name: '', func_key: '', func_fid: 0 },
	                        isLeaf: false, // 表示是否是叶子节点
	                        rules: {
				        func_name: [
					        {
					                validator: (rule, value, next) => {
                                                                if(value.length === 0)
                                                                        next(new Error('* 功能名不能为空'));
                                                                else if(value.length < 2 || value.length > 50)
                                                                        next(new Error('* 功能名长度2 - 50'));
                                                                else if(this.$store.state.func.list.findIndex(item => item.func_name === value && item.func_id !== this.model.func_id) !== -1)
                                                                        next(new Error('* 功能名已存在'));
                                                                else
                                                                        next();
					                },
						        trigger:'blur'
					        }
				        ],
		                        func_key: [
			                        {
			                                validator: (rule, value, next) => {
			                                        if(this.isLeaf && this.model.func_key === '')
			                                                next(new Error('* 请为叶子节点菜单绑定功能'));
			                                        else
			                                                next();
			                                },
				                        trigger: 'change'
			                        }
		                        ]
	                        }
                        }
	        },
	        computed: {
			fatherName() {
			        return this.model.func_fid === 0 ?
				        'root' :
				        this.$store.state.func.list.find(item => item.func_id === this.model.func_fid).func_name;
			}
	        },
	        created(){
			this.$store.dispatch('func/init');
	        },
                methods: {
			beginAdd(func){
                                this.$refs.form && this.$refs.form.resetFields();
			        this.isLeaf = func.func_id !== 0;
			        this.model.func_id = 0;
			        this.model.func_name = '';
			        this.model.func_key = '';
			        this.model.func_fid = func.func_id;
			        this.type = true;
			        this.isEdit = true;
			},
	                beginUpdate(func){
                                this.$refs.form && this.$refs.form.resetFields();
                                this.isLeaf = func.func_key !== '';
			        this.model.func_id = func.func_id;
			        this.model.func_name = func.func_name;
			        this.model.func_key = func.func_key;
			        this.model.func_fid = func.func_fid;
				this.type = false;
				this.isEdit = true;
	                },
	                async save() {
                                await this.$refs.form.validate();
                                await this.$store.dispatch(`func/${ this.type ? 'add' : 'update' }`,this.model);
                                this.$message({message: `${this.type ? '新增' : '修改'}功能节点：${this.model.func_name}成功！请刷新页面启用新的菜单！`,type: 'success'});
                                this.isEdit = false;

	                },
	                async beginRemove(func) {
				await this.$confirm(`确定要删除系统功能：${func.func_name}`,{title:'提示', type:'warning'});
		                await this.$store.dispatch('func/remove',func.func_id);
		                this.$message({message:`删除系统功能：${func.func_name}成功！`, type: 'success' });

	                }
                }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.el-tree
		width: 500px
		.custom-tree-node
			width: 100%
			display: flex
			justify-content: space-between
			align-items: center
			font-size: 16px
			i
				font-size: 18px
</style>