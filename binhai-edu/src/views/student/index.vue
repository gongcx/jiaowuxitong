<template>
	<el-container>
		<el-header>
			<el-form inline="" width="500px">
				<el-form-item label="学生姓名">
					<el-input v-model="search.stu_name" placeholder="请输入内容" @change="pagination.currentPage = 1;getStu();"></el-input>
				</el-form-item>
				<el-form-item label="所在班级">
					<el-select v-model="search.stu_cls_id" @change="pagination.currentPage = 1;getStu();">
						<el-option :value="0" label="- 请选择 -"></el-option>
						<el-option :value="null" label="无班级"></el-option>
						<el-option
							v-for="item in classList"
							:key="item.cls_id"
							:value="item.cls_id"
							:label="item.cls_name"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="学生学历">
					<el-select v-model="search.stu_qualification" @change="pagination.currentPage = 1;getStu();">
						<el-option :value="0" label="- 请选择 -"></el-option>
						<el-option
							v-for="item in dicData.filter(item => item.dic_group_key === 'qualification')"
							:key="item.dic_id"
							:value="item.dic_id"
							:label="item.dic_name"
						></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div>
				<el-button type="primary" icon="el-icon-plus" @click="beginAdd();">新增</el-button>
				<el-button icon="el-icon-setting" @click="clsConfig.isEdit = true" :disabled="this.clsConfig.stu_ids.length === 0">批量分班</el-button>
				<el-button @click="exportExcel" type="warning" icon="el-icon-download">导出学生信息</el-button>
			</div>

		</el-header>
		<el-main>
			<el-table :data="list" border stripe ref="report-table" @selection-change="handleSelectionChange" id="educe-table">
				<el-table-column type="index" label="#" align="center" width="50" fixed="left"></el-table-column>
				<el-table-column type="selection" width="50" align="center" fixed="left"></el-table-column>
				<el-table-column label="学生姓名" width="150" align="center" prop="stu_name" fixed="left"></el-table-column>
				<el-table-column label="班级" width="150" align="center">
					<template slot-scope="{row:{stu_cls_id}}">
						<el-link :underline="false" :type="stu_cls_id ? 'success' : 'info'">{{stu_cls_id ? classList.find(item => item.cls_id === stu_cls_id).cls_name : '无班级'}}</el-link>
					</template>
				</el-table-column>
				<el-table-column label="存档照片" width="150" align="center">
					<template slot-scope="{row}">
						<el-popover
							:title="row.stu_name"
							trigger="click"
							placement="right"
						>
							<el-image  v-if="row.stu_avatar" style="width: 200px" :src="row.stu_avatar"></el-image>
							<p v-else>该生照片还未存档</p>

							<el-link type="primary" slot="reference">预览</el-link>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column label="性别" width="50" align="center">
					<template slot-scope="{row:{stu_sex}}">
						<el-link :underline="false">{{stu_sex === 0 ? '男' : '女'}}</el-link>
					</template>
				</el-table-column>
				<el-table-column label="联系电话" width="200" align="center" prop="stu_phone"></el-table-column>
				<el-table-column label="备用电话" width="200" align="center" prop="stu_phone2"></el-table-column>
				<el-table-column label="出生日期" width="200" align="center" prop="stu_born"></el-table-column>
				<el-table-column label="学历" width="150" align="center" >
					<template slot-scope="{row:{stu_qualification}}">
						<el-link :underline="false">{{dicData.find(item => item.dic_id === stu_qualification).dic_name}}</el-link>
					</template>
				</el-table-column>
				<el-table-column label="所在学院" width="250" align="center" prop="stu_school"></el-table-column>
				<el-table-column label="院校专业" width="250" align="center" prop="stu_major"></el-table-column>
				<el-table-column label="家庭住址" width="300" align="center" prop="stu_address"></el-table-column>
				<el-table-column label="备注" width="300" align="center">

				</el-table-column>
				<el-table-column label="操作" width="350" align="center" fixed="right">
					<template slot-scope="{row}">
						<el-button size="mini" icon="el-icon-setting" @click="beginClsConfig(row)">分班</el-button>
						<el-button size="mini" type="success" icon="el-icon-picture-outline" @click="beginAvatarUpload(row)">照片存档</el-button>
						<el-button size="mini" icon="el-icon-edit" type="primary" @click="beginUpdate(row)">编辑</el-button>
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
				@size-change="pagination.currentPage = 1;getStu();"
				@current-change="getStu"
			>

			</el-pagination>
		</el-footer>
		<!--新增修改弹出框-->
		<el-dialog :visible.sync="edit.isEdit" :title=" edit.type ? '学生编辑 - 新增 -' : '学生编辑 - 修改 -'" :modal="false" width="600px">
			<el-form  label-width="110px" status-icon :model="edit.model" ref="form" :rules="edit.rules">
				<el-form-item label="学生姓名" prop="stu_name">
					<el-input v-model="edit.model.stu_name"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio v-model="edit.model.stu_sex" :label="0">男</el-radio>
					<el-radio v-model="edit.model.stu_sex" :label="1">女</el-radio>
				</el-form-item>
				<el-form-item label="联系电话" prop="stu_phone">
					<el-input v-model="edit.model.stu_phone"></el-input>
				</el-form-item>
				<el-form-item label="备用电话" placeholder="可选填">
					<el-input v-model="edit.model.stu_phone2"></el-input>
				</el-form-item>
				<el-form-item label="出生日期">
					<el-date-picker
						v-model="edit.model.stu_born"
						type="date"
						placeholder="请选择日期"
						value-format="yyyy-MM-dd"
					>

					</el-date-picker>
				</el-form-item>
				<el-form-item label="学历" prop="stu_qualification">
					<el-select v-model="edit.model.stu_qualification" placeholder="请选择">
						<el-option
							v-for="item in dicData.filter(item => item.dic_group_key === 'qualification')"
							:key="item.dic_id"
							:value="item.dic_id"
							:label="item.dic_name"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="在读/毕业院校">
					<el-input v-model="edit.model.stu_school" value="青岛滨海学院" disabled></el-input>
				</el-form-item>
				<el-form-item label="在校学习专业" prop="stu_major">
					<el-input v-model="edit.model.stu_major"></el-input>
				</el-form-item>
				<el-form-item label="家庭住址" prop="stu_address">
					<el-input v-model="edit.model.stu_address"></el-input>
				</el-form-item>
				<el-form-item label="学生备注">
					<el-input v-model="edit.model.stu_remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="edit.isEdit = false">取消</el-button>
				<el-button type="primary" @click="save">确定</el-button>
			</div>
		</el-dialog>
		<!--分班弹出框-->
		<el-dialog :visible.sync="clsConfig.isEdit" :modal="false" title="班级分配">
			<el-select v-model="clsConfig.stu_cls_id">
				<el-option :value="null" label="无班级"></el-option>
				<el-option
					v-for="item in classList"
					:key="item.cls_id"
					:label="item.cls_name"
					:value="item.cls_id"
					:disabled="item.cls_end !== null"
				></el-option>
			</el-select>
			<div slot="footer">
				<el-button @click="clsConfig.isEdit = false">取消</el-button>
				<el-button type="primary" @click="clsConfigHandle">确定</el-button>
			</div>
		</el-dialog>
		<!--照片存档弹出框-->
		<el-dialog :visible.sync="avatarUpload.isEdit" :modal="false" title="照片存档" width="650px">
			<el-form inline>
				<el-form-item label="个人照片">
					<el-image style="width: 200px" :src="avatarUpload.avatarUrl"></el-image>
				</el-form-item>
				<el-form-item>
					<div class="bor">

					</div>
				</el-form-item>
				<el-form-item>
					<el-upload
						ref="upload"
						action="/student/avatarupload"
						:on-success="uploadSuccess"
						name="avatar"
						:headers="{Authorization: avatarUpload.token}"
						list-type="picture"
						:before-upload="beforeUpload"
						accept=".jpg,.png"
					>
						<i slot="trigger" class="el-icon-plus avatar-uploader-icon"></i>
						<br>
						<el-link slot="tip"  :underline="false"  type="danger">只能上传jpg/png且大小不能超过2M</el-link>
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="avatarUpload.isEdit=false; $refs.upload.clearFiles();">取消</el-button>
				<el-button :disabled="avatarUpload.model.stu_avatar_new === null" type="primary" @click="upload">存档</el-button>
			</div>
		</el-dialog>
	</el-container>
</template>

<script type="text/ecmascript-6">
	import FileSaver from 'file-saver';
	import XLSX from 'xlsx';
	import { mapState,mapActions } from 'vuex';
        export default {
                name: 'Student',
	        data() {
                        return {
                                search: { stu_name: '', stu_cls_id: 0,stu_qualification: 0 },
                                pagination: {total: 0, pageSize: 6, currentPage: 1},
	                        list: [],
	                        edit: {
                                        isEdit: false,
		                        model: {
                                                stu_id: 0,
			                        stu_name: '',
			                        stu_avatar: null,
			                        stu_cls_id: null,
			                        stu_sex: 0,
			                        stu_phone: '',
			                        stu_phone2: '',
			                        stu_born:'',
			                        stu_qualification: 0,
			                        stu_school: '青岛滨海学院',
			                        stu_major: '',
			                        stu_address: '',
			                        stu_remark: ''},
		                        type: true,
					rules: {
                                                stu_name: [
	                                                { required: true, message: '* 学生姓名不能为空！', trigger: 'blur' }
                                                ],
						stu_phone: [
							{
							        validator: function(rule, value, next){
								        let reg = /^1[345789]\d{9}$/;
							                if(value.length === 0){
							                        next(new Error('* 请输入11位的手机号！'));
							                }else if(!reg.test(value)){
							                        next(new Error('* 请输入11位有效手机号号码！'));
							                }else{
							                        next();
							                }
							        },
								trigger: 'blur'
							}
						],
                                                stu_qualification: [
                                                        { required: true, message: '* 学历不能为空！', trigger: 'blur', type:'number' }
                                                ],
                                                stu_major: [
                                                        { required: true, message: '* 专业不能为空！', trigger: 'blur' }
                                                ],
                                                stu_address: [
                                                        { required: true, message: '* 家庭住址不能为空！', trigger: 'blur' }
                                                ]
					}
	                        },
	                        clsConfig: {
                                        isEdit: false,
		                        stu_cls_id: null,
                                        stu_ids: [],
                                        stu_id: null
	                        },
                                avatarUpload: {
                                        isEdit: false,
	                                model: {stu_id: 0, stu_avatar_old: null, stu_avatar_new: null },
	                                avatarUrl: '',
	                                token: ''
                                }
                        }
	        },
	        async created() {
                        await this.getClassList();
                        await this.getDic();
                        await this.getStu();
	        },
	        computed: {
		        ...mapState('student',['classList']),
		        ...mapState(['dicData']),
	        },
	        methods: {
		        ...mapActions('student',['getClassList']),
		        ...mapActions(['getDic']),
		        async getStu(){
				let { total, list } = await this.$http({url: '/student/list',method: 'post', data: {...this.search,begin: this.pagination.pageSize * (this.pagination.currentPage - 1), pageSize: this.pagination.pageSize}});
		                this.pagination.total = total;
		                this.list = list;
		        },
		        beginAdd(){
		                this.$refs.form && this.$refs.form.resetFields();
		                this.edit.model = {
                                        stu_id: 0,
                                        stu_name: '',
                                        stu_avatar: null,
                                        stu_cls_id: null,
                                        stu_sex: 0,
                                        stu_phone: '',
                                        stu_phone2: '',
                                        stu_born:'',
                                        stu_qualification: "",
                                        stu_school: '青岛滨海学院',
                                        stu_major: '',
                                        stu_address: '',
                                        stu_remark: ''};
		                this.edit.type = true;
		                this.edit.isEdit = true;
		        },
		        beginUpdate(stu){
                                this.edit.model = {
                                        stu_id: 0,
                                        stu_name: stu.stu_name,
                                        stu_avatar: stu.stu_avatar,
                                        stu_cls_id: stu.stu_cls_id,
                                        stu_sex: stu.stu_sex,
                                        stu_phone: stu.stu_phone,
                                        stu_phone2: stu.stu_phone2,
                                        stu_born:stu.stu_born,
                                        stu_qualification: stu.stu_qualification,
                                        stu_school: '青岛滨海学院',
                                        stu_major:stu.stu_major ,
                                        stu_address: stu.stu_address,
                                        stu_remark: stu.stu_remark};
                                this.edit.type = false;
                                this.edit.isEdit = true;
                                this.valid = stu.stu_phone;// 验证编辑时手机号是否合理
		        },
		        async save() {
                                await this.$refs.form.validate();
				if(this.edit.type){
				        let valid = await this.$http({url: '/student//valid_phone',method: 'post', data: {...this.edit.model}});
				        if(valid === 0){
				                let id = await this.$http({url: '/student/add', method: 'post', data: {...this.edit.model}});
						this.edit.model.stu_id = id;
						this.pagination.total = this.pagination.total + 1;
						// todo... 学生信息增加了，系统用户也会增加一个用户，用户名是手机号，密码是123
						this.list.push({...this.edit.model});
                                                this.$message({message: '学生信息添加成功！', type: 'success'});
                                                this.edit.isEdit = false;
				        }else {
                                                await this.$alert('您输入的手机号不合理，请重新输入','提示',{type: 'warning'});
				        }
				}else{
					if(this.valid !== this.edit.model.stu_phone){
                                                let valid = await this.$http({url: '/student//valid_phone',method: 'post', data: {...this.edit.model}});
                                                if(valid !== 0){
                                                        await this.$alert('您输入的手机号不合理，请重新输入','提示',{type: 'warning'});
                                                        return;
                                                }
					}
                                        await this.$http({url: '/student/update',method:'post',data: {...this.edit.model}});
                                        let i = this.list.findIndex(item => item.stu_id === this.edit.model.stu_id);
                                        this.list.splice(i,1,{...this.edit.model});
                                        this.$message({message: '学生信息修改成功！', type: 'success'});
                                        this.edit.isEdit = false;
				}
		        },
                        handleSelectionChange(val){
                                this.clsConfig.stu_ids = [];
				val.forEach(item => this.clsConfig.stu_ids.push(item.stu_id));
                        },
		        beginClsConfig(stu){
				this.clsConfig.stu_ids = [];
				this.clsConfig.stu_id = stu.stu_id;
				this.clsConfig.isEdit = true;
		        },
		        // 分班
		        async clsConfigHandle(){
				await this.$http({url: '/student/assignclass',method: 'post', data: {...this.clsConfig}});
				if(this.clsConfig.stu_ids.length === 0){
                                        let target = this.list.find(item => item.stu_id === this.clsConfig.stu_id);
                                        target.stu_cls_id = this.clsConfig.stu_cls_id;
				}else{
				        this.clsConfig.stu_ids.forEach(item => {
				                this.list.forEach(item2 => {
				                        if(item2.stu_id === item){
				                                item2.stu_cls_id = this.clsConfig.stu_cls_id;
				                                return;
				                        }
				                });
				        });
				}
				this.$message({message: '班级分配成功！', type: 'success'});
				this.clsConfig.isEdit = false;
		        },
		        // 图片存档
                        beginAvatarUpload(stu){
                                this.avatarUpload.token = sessionStorage.getItem('token');
                                this.avatarUpload.model.stu_avatar_new = null;
				this.avatarUpload.model.stu_id = stu.stu_id;
				this.avatarUpload.avatarUrl = stu.stu_avatar;
                                this.avatarUpload.isEdit = true;
                        },
                        beforeUpload(file){
                                if(file.size > 2048000){
                                        this.$message({message: '上传的图片不能超过2M',type: 'warning'});
                                        return false;
                                }else{
                                        return true;
                                }
                        },
		        // 图片预上传成功
                        uploadSuccess(res,file,fileList){
				if(res.status === 200){
				        if(fileList.length>1){
						fileList.shift();
				        }
				        this.avatarUpload.model.stu_avatar_new = res.data;
				        this.avatarUpload.avatarUrl = '/tmp/'+res.data;
				}else{
				        this.$message({message: res.message});
				}
                        },
                        async upload(){
				let url = await this.$http({url: '/student/avatarupdate', method: 'post',data: {...this.avatarUpload.model}});
				let target = this.list.find(item => item.stu_id === this.avatarUpload.model.stu_id);
				target.stu_avatar = url;
				this.$message({message: '图片存档成功！',type:'success'});
				this.avatarUpload.isEdit = false;
                        },
		        // 导出图片
                        exportExcel(excelName = "学生表格") {
                                //excelName --设置导出的excel名称
                                //report-table --对应的要导出的el-table的ref名称
                                try {
                                        const $e = this.$refs['report-table'].$el;
                                        // 如果表格加了fixed属性，则导出的文件会生产两份一样的数据，所以可在这里判断一下
                                        let $table = $e.querySelector('.el-table__fixed');
                                        if (!$table) {
                                                $table = $e;
                                        }
                                        // 为了返回单元格原始字符串，设置{ raw: true }
                                        const wb = XLSX.utils.table_to_book($table, { raw: true });
                                        const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
                                        FileSaver.saveAs(
                                                new Blob([wbout], { type: 'application/octet-stream' }),
                                                `${excelName}.xlsx`,
                                        );
                                } catch (e) {
                                        if (typeof console !== 'undefined') console.error(e);
                                }
                                // 生成Excel工作簿对象
//                                let wb = XLSX.utils.table_to_book(document.querySelector('#educe-table'));
//                                // 获取二进制字符串作为输出
//                                let wbout = XLSX.write(wb, {
//                                        bookType: 'xlsx',
//                                        book: true,
//                                        type: 'array',
//                                });
//                                try {
//                                        FileSaver.saveAs(
//                                                // Blob: 对象表示一个不可变 原始数据的类文件对象,不一定是JS原生格式的数据。
//                                                // File: 基于Blob，继承了blob的功能并将其扩展使其支持用户系统上的文件。
//                                                new Blob([wbout], { type: 'appliction/octet-stream' }),
//                                                // 设置导出的文件名称可随意
//                                                'result.xlsx'
//                                        )
//                                } catch (e) {
//                                        if (typeof console != 'undefined') console.log(e, wbout);
//                                }
//                                // 返回一个新创建的Blob对象，其内容由参数中给定的数组串联组成。
//                                return wbout
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
	.avatar-uploader-icon
		width 150px
		height 150px
		border 1px dashed #ccc
		border-radius 5px
		line-height 150px
	.el-icon-plus
		font-size 60px
		font-weight 100
</style>