<template>
	<div>
		<el-header>
			<span>未使用：</span><el-button type="success"  circle></el-button>
			<span class="tig">已使用：</span><el-button type="warning" circle></el-button>
		</el-header>
		<el-row :gutter="20">
			<el-col :span="6"
				v-for="item in list"
			        :key="item.clsr_id"
			>
				<el-card :class="{occupy: item.clsr_occupy ===0}">
					<h4 v-text="item.clsr_name"></h4>
					<div class="btn-wrapper">
						<el-button type="text" icon="el-icon-edit" @click="beginUpdate(item)"></el-button>
						<el-button type="text" @click="removeHandler(item.clsr_id)" icon="el-icon-delete" v-if="item.clsr_occupy ===0"></el-button>
					</div>

				</el-card>
			</el-col>
			<el-col :span="6" >
				<el-card class="plus" @click.native="beginAdd" >
					<i class="el-icon-plus"></i>
				</el-card>
			</el-col>
		</el-row>
		<el-dialog
			:modal="false"
			title="教室编辑"
		        :visible.sync="isEdit"
		        width="30%"
		>
			<el-form label-width="75px" :model="model" :rules="rules" status-icon ref="form">
				<el-form-item label="教室名" prop="clsr_name">
					<el-input v-model="model.clsr_name"></el-input>
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
	import { mapState,mapMutations,mapActions } from 'vuex'
        export default {
                name: 'Classroom',
	        data(){
                        return {
				isEdit: false,
	                        model: { clsr_id: 0, clsr_name: '', clsr_occupy: 0 },
	                        type: true,
                                rules: {
                                        clsr_name: [
                                                {
                                                        validator: (rule,value,next) => {
                                                                if(value.length === 0)
                                                                        next(new Error('* 教室名不能为空'));
                                                                else if(value.length < 2 || value.length > 20)
                                                                        next(new Error('* 教室名长度2 - 20'));
                                                                else if(this.type && this.list.some(item => item.clsr_name === this.model.clsr_name))
                                                                        next(new Error('* 教室名已存在'));
                                                                else
                                                                        next();
                                                        },
	                                                trigger: 'blur'
                                                }
                                        ]
                                }
                        }
	        },
	        computed: {
		        ...mapState('classroom',['list'])
	        },
	        async created() {
			await this.init();
	        },
	        methods: {
		        ...mapActions('classroom',['init','add','remove','update']),
		        async removeHandler(clsr_id){
				await this.$confirm('确定要删除吗？','提示');
				await this.remove(clsr_id);
				this.$message({message: '删除成功！',type: 'success'});
		        },
		        beginAdd(){
                                this.$refs.form && this.$refs.form.resetFields();
		                this.model = { clsr_id: 0, clsr_name: '', clsr_occupy: 0  };
		                this.type = true;
		                this.isEdit = true;
		        },
		        beginUpdate(clsr){
                                this.$refs.form && this.$refs.form.resetFields();
				this.model = clsr;
				this.type = false;
				this.isEdit = true;
		        },
		        async save() {
                                await this.$refs.form.validate();
				await this[this.type ? 'add' : 'update']({...this.model});
				this.$message({message: `教室${this.type ? '添加' : '修改'}成功！`, type:'success'});
				this.isEdit = false;
		        }
	        }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.el-header
		display flex
		align-items center
		padding 0
		.tig
			margin-left 10px
	.btn-wrapper
		position absolute
		left 0
		top 0
		width 100%
		height 100%
		background-color rgba(0,0,0,0.6)
		display none
		justify-content center
		align-items center
		.el-button
			color #fff
			font-size 40px
	.el-col
		margin-bottom 20px
	.occupy
		background-color #67C23A!important
	.el-card
		background-color #E6A23C
		position relative
		padding-top 50%
		cursor pointer
		color #fff
		font-size 40px
		&:hover .btn-wrapper
			display flex
		& >>> .el-card__body
			display flex
			justify-content center
			align-items center
			position absolute
			left 0
			top 0
			width 100%
			height 100%
			padding 0
	.plus >>> .el-card__body
		background-color #fff
		color blue


</style>