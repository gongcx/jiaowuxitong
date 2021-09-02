<template>
	<el-container>
		<el-header>
			<el-form inline >
				<el-form-item label="班级名称">
					<el-input v-model="search.cls_name" @change="pagination.currentPage = 1;getClass();"></el-input>
				</el-form-item>
				<el-form-item label="班级专业">
					<el-select v-model="search.cls_dic_id_major" @change="pagination.currentPage = 1;getClass();">
						<el-option :value="0" label="- 请选择 -"></el-option>
						<el-option
							v-for="item in dicData.filter(item => item.dic_group_key === 'class_major')"
							:key="item.dic_id"
							:value="item.dic_id"
							:label="item.dic_name"
						>

						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级状态">
					<el-select v-model="search.cls_status" @change="pagination.currentPage = 1;getClass();">
						<el-option :value="0" label="- 所有 -"></el-option>
						<el-option :value="1"  label="开课中"></el-option>
						<el-option :value="2" label="未开课"></el-option>
						<el-option :value="3" label="结课"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<el-button type="primary" icon="el-icon-plus" @click="beginAdd">新增</el-button>
		</el-header>
		<el-main>
			<el-table :data="list" border stripe>
				<el-table-column type="index" label="#" width="40px" align="center"></el-table-column>
				<el-table-column label="班级名称" prop="cls_name" min-width="50px" align="center"></el-table-column>
				<el-table-column label="班级专业"  min-width="100px" align="center">
					<template slot-scope="{row}">
						<span>{{row.cls_dic_id_major && dicData.find(item => item.dic_id === row.cls_dic_id_major).dic_name}}</span>
					</template>
				</el-table-column>
				<el-table-column label="学生干事" min-width="50px" align="center">
					<template slot-scope="{row}">
						<span>{{ row.cls_stf_id_teacher && stfList.find(item => item.stf_id === row.cls_stf_id_teacher).stf_name}}</span>
					</template>
				</el-table-column>
				<el-table-column label="教学干事" min-width="50px" align="center">
					<template slot-scope="{row}">
						<span>{{ row.cls_stf_id_admin && stfList.find(item => item.stf_id === row.cls_stf_id_admin).stf_name}}</span>
					</template>
				</el-table-column>
				<el-table-column label="班主任" min-width="50px" align="center">
					<template slot-scope="{row}">
						<span>{{ row.cls_stf_id_job && stfList.find(item => item.stf_id === row.cls_stf_id_job).stf_name}}</span>
					</template>
				</el-table-column>
				<el-table-column label="教室" min-width="50px" align="center">
					<template slot-scope="{row}">
						<el-link>{{row.cls_clsr_id && clsrList.find(item => item.clsr_id === row.cls_clsr_id).clsr_name}}</el-link>
					</template>
				</el-table-column>
				<el-table-column label="开课时间" min-width="100px" align="center">
					<template slot-scope="{row:{cls_begin}}">
						<el-link icon="el-icon-data-line" :underline="false" type="success">{{cls_begin}}</el-link>
					</template>
				</el-table-column>
				<el-table-column label="结课时间" min-width="100px" align="center">
					<template slot-scope="{row:{cls_end}}">
						<el-link :underline="false" icon="el-icon-data-analysis" type="danger">{{cls_end}}</el-link>
					</template>
				</el-table-column>
				<el-table-column label="班级状态" min-width="70px" align="center">
					<template slot-scope="{row}">
						<el-link :underline="false" :type="row.cls_end && 'danger' || row.cls_begin && 'success' || 'warning'">{{row.cls_end && '已结课' || row.cls_begin && '开课中' || '未开课'}}</el-link>
					</template>
				</el-table-column>
				<el-table-column label="备注" prop="cls_remark" min-width="80px" align="center"></el-table-column>
				<el-table-column label="操作"   min-width="150px" fixed="right">
					<template slot-scope="{row}">
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="beginUpdate(row)">编辑</el-button>
						<el-button v-if="!row.cls_end" :type="row.cls_begin ? 'danger' : 'success'" size="mini" @click="sos(row)">{{row.cls_begin ? '结课' : '开课'}}</el-button>
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
				layout="prev, pager, next,jumper,->,sizes,total"
				@size-change="pagination.currentPage = 1;getClass();"
				@current-change="getClass"
			>

			</el-pagination>
		</el-footer>
		<el-dialog :visible.sync="edit.isEdit" title="编辑班级" :modal="false" width="500px">
			<el-form label-width="80px" status-icon ref="form" :rules="edit.rules" :model="edit.model">
				<el-form-item label="班级名称"  prop="cls_name">
					<el-input v-model.trim="edit.model.cls_name"></el-input>
				</el-form-item>
				<el-form-item label="班级专业" prop="cls_dic_id_major">
					<el-select v-model="edit.model.cls_dic_id_major" placeholder="- 请选择 -" >
						<el-option
							v-for="item in dicData.filter(item => item.dic_group_key === 'class_major')"
							:key="item.dic_id"
							:value="item.dic_id"
							:label="item.dic_name"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="学生干事" prop="cls_stf_id_teacher">
					<el-select  v-model="edit.model.cls_stf_id_teacher" placeholder="- 请选择 -">
						<el-option
							v-for="item in stfList.filter(item => item.stf_category === 4 )"
							:key="item.stf_id"
							:value="item.stf_id"
							:label="item.stf_name"
							:disabled="item.stf_invalid === 0"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="教学干事" prop="cls_stf_id_admin">
					<el-select v-model="edit.model.cls_stf_id_admin" placeholder="- 请选择 -">
						<el-option
							v-for="item in stfList.filter(item => item.stf_category === 5)"
							:key="item.stf_id"
							:value="item.stf_id"
							:label="item.stf_name"
							:disabled="item.stf_invalid === 0"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班主任" prop="cls_stf_id_job">
					<el-select v-model="edit.model.cls_stf_id_job" placeholder="- 请选择 -" >
						<el-option
							v-for="item in stfList.filter(item => item.stf_category === 6)"
							:key="item.stf_id"
							:value="item.stf_id"
							:label="item.stf_name"
							:disabled="item.stf_invalid === 0"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级备注">
					<el-input type="text" v-model="edit.model.cls_remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="edit.isEdit = false">取消</el-button>
				<el-button type="primary" @click="save">确定</el-button>
			</div>
		</el-dialog>
		<el-dialog :visible.sync="edit2.isEdit" title="班级分配" :modal="false" width="500px">
			<el-form status-icon ref="form2" :rules="edit2.rules" :model="edit2.model">
				<el-form-item label="教室" prop="cls_clsr_id">
					<el-select v-model="edit2.model.cls_clsr_id" placeholder="- 请选择 -">
						<el-option
							v-for="item in clsrList"
							:key="item.clsr_id"
							:value="item.clsr_id"
							:label="item.clsr_name"
							:disabled="item.clsr_occupy === 1"
						>

						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="edit2.isEdit = false">取消</el-button>
				<el-button type="primary" @click="begin">分配</el-button>
			</div>
		</el-dialog>
	</el-container>
</template>

<script type="text/ecmascript-6">
	import {mapState, mapActions,mapMutations} from 'vuex';
        export default {
                name: 'Class',
	        data() {
                        return {
                                loading: false,
                                list: [],
                                search: { cls_name: '', cls_dic_id_major: 0, cls_status: 0},
	                        pagination: {total: 0, pageSize: 6, currentPage: 1},
	                        edit: {
                                        isEdit: false,
		                        model: {cls_id: 0, cls_name: '', cls_dic_id_major: 0,cls_clsr_id: null, cls_stf_id_teacher: 0, cls_stf_id_admin: 0, cls_stf_id_job: 0, cls_begin: null, cls_end: null, cls_remark: ''},
		                        type: true,
                                        rules: {
                                                cls_name: [
                                                        { required: true, message: '* 班级名称不能为空',trigger: 'blur' },
                                                        { min: 3, max: 20, message: '班级名称长度在3到20个字符', trigger: 'blur' }
                                                ],
                                                cls_dic_id_major: [
		                                        { required: true,message: '* 班级专业不能为空',type:'number'  ,trigger: ['change']}
	                                        ],
                                                cls_stf_id_teacher: [
                                                        { required: true,message: '* 教学老师不能为空',type:'number'  ,trigger: ['change']}
                                                ],
                                                cls_stf_id_admin: [
                                                        { required: true,message: '* 教务老师不能为空',type:'number'  ,trigger: ['change']}
                                                ],
                                                cls_stf_id_job: [
                                                        { required: true,message: '* 就业老师不能为空',type:'number'  ,trigger: ['change']}
                                                ]
                                        }
	                        },
	                        edit2: {
                                        isEdit: false,
                                        model: { cls_id: 0, cls_clsr_id: 0 },
                                        rules: {
                                                cls_clsr_id: [
                                                        { required: true,message: '* 教室不能为空',type:'number'  ,trigger: ['change','blur']}
                                                ]
                                        }
	                        }
                        }
	        },
	        computed: {
		        ...mapState(['dicData']),
		        ...mapState('classroom',{clsrList: 'list'}),
		        ...mapState('classStore',['stfList'])
	        },
	        async created(){
                        await this.init();
                        await this.getDic();
                        await this.stfInit();
                        this.getClass();
                },
	        methods: {
		        ...mapActions('classStore',['stfInit']),
		        ...mapActions('classroom',['init']),
                        ...mapActions(['getDic']),
		        ...mapMutations('classroom',['beginOccupy','endOccupy']),
		        ...mapMutations('student',['addClass', 'updateClass']),
		        async getClass(){
		                let { total,list } = await this.$http({url: '/class/list',method: 'post',data: {
			                ...this.search,
			                begin: this.pagination.pageSize * (this.pagination.currentPage - 1),
			                pageSize: this.pagination.pageSize
		                }});
                                list.forEach(item => {
                                        item.cls_dic_id_major_name = this.dicData.find(item2 => item2.dic_id === item.cls_dic_id_major).dic_name;
                                });
		                this.pagination.total = total;
		                this.list = list;
		        },
		        beginAdd(){
                                this.$refs.form && this.$refs.form.resetFields();
				this.edit.model = {cls_id: 0, cls_name: '', cls_dic_id_major: "",cls_clsr_id: null, cls_stf_id_teacher: '', cls_stf_id_admin: '', cls_stf_id_job: '', cls_begin: null, cls_end: null, cls_remark: ''};
				this.edit.type=true;
				this.edit.isEdit = true;
		        },
		        beginUpdate(cls){
                                this.$refs.form && this.$refs.form.resetFields();
				this.edit.model = {
				        cls_id: cls.cls_id,
					cls_name: cls.cls_name,
					cls_dic_id_major: cls.cls_dic_id_major,
					cls_clsr_id: cls.cls_clsr_id ? cls.cls_clsr_id : null,
					cls_stf_id_teacher: cls.cls_stf_id_teacher,
					cls_stf_id_admin: cls.cls_stf_id_admin,
					cls_stf_id_job: cls.cls_stf_id_job,
					cls_begin:cls.cls_begin,
					cls_end: cls.cls_end,
					cls_remark: cls.cls_remark,
				};
				this.valid = cls.cls_name;
				this.edit.type = false;
				this.edit.isEdit = true;
		        },
		        async save() {
                                await this.$refs.form.validate();
		                if(this.edit.type){
		                        let valid = await this.$http({url: '/class/valid_name',method: 'post', data: {cls_name: this.edit.model.cls_name}});
		                        if(valid ===1) {await this.$alert('您输入的班级名称不合理，请重新输入','提示',{type: 'warning'}); return;}
		                        let id = await this.$http({url: '/class/add',method: 'post', data: {...this.edit.model}});
		                        this.edit.model.cls_id = id;
		                        this.list.push({...this.edit.model});
		                        this.pagination.total = this.pagination.total + 1;
		                        this.addClass({...this.edit.model});
		                        this.$message({ message: '班级添加成功！', type: 'success' });
                                        this.edit.isEdit = false;
		                }else{
		                        if(this.valid !== this.edit.model.cls_name){
                                                let valid = await this.$http({url: '/class/valid_name',method: 'post', data: {cls_name: this.edit.model.cls_name}});
                                                if(valid ===1) {await this.$alert('您输入的班级名称不合理，请重新输入','提示',{type: 'warning'}); return;}
		                        }
		                        await this.$http({url: '/class/update',method: 'post', data: {...this.edit.model}});
		                        let i = this.list.findIndex(item => item.cls_id === this.edit.model.cls_id);
		                        this.list.splice(i,1,{...this.edit.model});
		                        this.updateClass({...this.edit.model});
                                        this.$message({ message: '班级修改成功！', type: 'success' });
                                        this.edit.isEdit = false;
		                }
		        },
		        // 开课结课
		        async sos(cls) {
		                this.edit2.model = { cls_id: cls.cls_id, cls_clsr_id: cls.cls_clsr_id };
                                if(cls.cls_clsr_id ){
                                        await this.$confirm('确定要结束课程吗？','提示',{type:'warning'});
                                        let endTime = await this.$http({url:'/class/end', method: 'post', data: {...this.edit2.model}});
                                        let target = this.list.find(item => item.cls_id === this.edit2.model.cls_id);
                                        target.cls_end = endTime;
                                        let clsr = this.clsrList.find(item => item.clsr_id === this.edit2.model.cls_clsr_id);
                                        clsr.clsr_occupy = 0;
                                        this.endOccupy(this.edit2.model.cls_clsr_id);
                                        this.$message({message: '课程结束成功！',type: 'success'});
                                }else {
                                        await this.$confirm('确定要开始课程吗？','提示',{type:'warning'});
                                        this.$refs.form2 && this.$refs.form2.resetFields();
	                                this.edit2.isEdit = true;
                                }
		        },
		        // 开课
		        async begin(){
                                await this.$refs.form2.validate();
				let beginTime = await this.$http({url: '/class/begin',method: 'post',data: {...this.edit2.model}});
				let target = this.list.find(item => item.cls_id === this.edit2.model.cls_id);
                                target.cls_begin = beginTime;
                                target.cls_clsr_id = this.edit2.model.cls_clsr_id;
                                let clsr = this.clsrList.find(item => item.clsr_id === this.edit2.model.cls_clsr_id);
                                clsr.clsr_occupy = 1;
                                this.beginOccupy(this.edit2.model.cls_clsr_id);
				this.$message({message: '开启课程成功！',type: 'success'});
                                this.edit2.isEdit = false;
		        }
	        }
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
	.el-main
		overflow hidden
		.el-table
			overflow auto
</style>