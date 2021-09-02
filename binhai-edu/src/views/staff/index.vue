<template>
	<el-container>
		<el-header>
			<el-form inline>
				<el-form-item label="员工姓名">
					<el-input v-model="search.stf_name" @change="pagination.currentPage = 1;getStaff();">

					</el-input>
				</el-form-item>
				<el-form-item label="员工类型">
					<el-select v-model="search.stf_category" @change="pagination.currentPage = 1;getStaff();">
						<el-option label="- 请选择 -" :value="0">

						</el-option>
						<el-option
							v-for="item in stfCateList"
							:key="item.dic_id"
							:value="item.dic_id"
							:label="item.dic_name"
						>

						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<el-button type="primary" icon="el-icon-plus" @click="beginAdd">新增</el-button>
		</el-header>
		<el-main>
			<el-table :data="list" border stripe>
				<el-table-column type="index" label="#" align="center" width="70"></el-table-column>
				<el-table-column label="姓名" width="150" prop="stf_name" align="center"></el-table-column>
				<el-table-column label="职务类型" width="150" align="center" >
					<template slot-scope="{row}">
						<span>{{ stfCateList.find(item => item.dic_id === row.stf_category).dic_name }}</span>
					</template>
				</el-table-column>
				<el-table-column label="备注" align="center" prop="stf_remark"></el-table-column>
				<el-table-column label="员工状态" align="center" width="100">
					<template slot-scope="{row}">
						<el-tag :type="row.stf_invalid ? 'success' : 'danger'">
							{{row.stf_invalid ? '在职' : '离职'}}
						</el-tag>
					</template>

				</el-table-column>
				<el-table-column label="操作" align="center" min-width="250" width="250" fixed="right">
					<template slot-scope="{row}">
						<el-button size="mini" type="primary" icon="el-icon-edit" @click="beginUpdate(row)">编辑</el-button>
						<el-button size="mini" :type="row.stf_invalid ? 'danger' : 'success'" icon="el-icon-user" @click="updateJob(row)">{{row.stf_invalid ? '离职' : '入职'}}</el-button>
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
				@size-change="pagination.currentPage = 1; getStaff();"
				@current-change="getStaff();"
			>

			</el-pagination>
		</el-footer>
		<el-dialog :visible.sync="this.edit.isEdit" title="员工编辑" width="500px" :modal="false">
			<el-form label-width="80px" ref="form" :model="edit.model" :rules="edit.rules" status-icon>
				<el-form-item label="员工姓名" prop="stf_name">
					<el-input v-model="edit.model.stf_name"></el-input>
				</el-form-item>
				<el-form-item label="员工类型">
					<el-select v-model="edit.model.stf_category">
						<el-option
							v-for="item in stfCateList"
							:key="item.dic_id"
							:value="item.dic_id"
							:label="item.dic_name"
						>

						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="员工备注">
					<el-input type="textarea" placeholder="请输入备注" v-model="edit.model.stf_remark">

					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="edit.isEdit = false">取消</el-button>
				<el-button type="primary" @click="save">确定</el-button>
			</div>
		</el-dialog>
	</el-container>

</template>

<script type="text/ecmascript-6">
	import { mapState,mapActions,mapMutations,mapGetters } from 'vuex';
        export default {
                name: 'Staff',
	        data(){
                        return {
                                edit: {
					isEdit: false,
	                                type: true,
	                                model: { stf_id: 0, stf_name: '', stf_category: 4, stf_remark: '' }, // todo..stf_category默认值设置
	                                rules: {
					        stf_name: [
						        { required: true, message: '* 员工姓名不能为空！'},
					        ]
	                                }
                                },
                                stfCateList: [],
	                        list: [],
				search: {
				        stf_name: '',
                                        stf_category: 0
				},
                                pagination: { total: 0, pageSize: 6, currentPage: 1 },
                        }
	        },
	        computed: {
		        ...mapState(['dicData'])
	        },
	        async created() {
			await this.getDic();
			this.stfCateList =await this.dicData.filter(item => item.dic_group_key === 'staff_category');
			await this.getStaff();
	        },
	        methods: {
		        ...mapActions(['getDic']),
		        ...mapMutations('classStore',['add','update']),
		        async getStaff(){
		                let { total, list } = await this.$http({url:'/staff/list',method: 'post',data: {
		                        ...this.search,
			                begin:this.pagination.pageSize*(this.pagination.currentPage-1),
			                pageSize: this.pagination.pageSize}});
		                this.pagination.total = total;
		                this.list = list;
		        },
		        beginAdd(){
		                this.$refs.form && this.$refs.form.resetFields();
				this.edit.model = { stf_id: 0, stf_name: '', stf_category: 4, stf_remark: '',stf_invalid: 1 };
				this.type = true;
				this.edit.isEdit = true;
		        },
		        beginUpdate(stf){
                                this.$refs.form && this.$refs.form.resetFields();
                                this.edit.model = { stf_id: stf.stf_id, stf_name: stf.stf_name, stf_category: stf.stf_category, stf_remark: stf.stf_remark,stf_invalid: stf.stf_invalid };
                                this.type = false;
                                this.edit.isEdit = true;
		        },
		        async updateJob(stf){
		                await this.$confirm(`确定要让员工：${stf.stf_name}${stf.stf_invalid ? '离职' : '入职'}吗？`,'提示',{type: 'warning'});
				await this.$http({url: `/staff/${stf.stf_invalid ? 'dimission' : 'reinstate'}/` + stf.stf_id});
                                let target = this.list.find(item => item.stf_id === stf.stf_id);
                                target.stf_invalid = stf.stf_invalid ? 0 : 1;
                                this.update(target);
                                this.$message({message: `员工${stf.stf_name}${stf.stf_invalid ? '入职' : '离职'}成功！`,type: 'success'});
		        },
		        async save() {
                                await this.$refs.form.validate();
		                if(this.type){
		                        let id = await this.$http({ url: '/staff/add', method: 'post', data: {...this.edit.model} });
		                        this.edit.model.stf_id = id;
		                        this.list.push({...this.edit.model});
		                        this.pagination.total = this.pagination.total + 1;
		                        this.add({...this.edit.model});
		                        this.$message({message: '员工添加成功！',type: 'success'});
                                        this.edit.isEdit = false;
                                }else{
		                        await this.$http({url:'/staff/update',method: 'post',data: {...this.edit.model}});
		                        let i = this.list.findIndex(item => item.stf_id === this.edit.model.stf_id);
		                        this.list.splice(i,1,{...this.edit.model});
                                        this.update({...this.edit.model});
		                        this.$message({ message:'员工信息修改成功！' ,type: 'success' });
                                        this.edit.isEdit = false;
                                }
		        },
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
			min-width 1200px
			display flex
			justify-content space-between
			.el-button
				align-self flex-start
</style>