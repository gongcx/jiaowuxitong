<template>
	<el-container>
		<el-main>
			<el-header height="auto">
				<el-button type="text" icon="el-icon-school" circle></el-button>
				<h5>青岛滨海学院教务管理系统</h5>
			</el-header>
			<el-form :model="model" :rules="rules" status-icon ref="form">
				<el-form-item prop="user_name">
					<el-input v-model="model.user_name" class="input-box" prefix-icon="el-icon-user" placeholder="请输入账号"></el-input>
				</el-form-item>
				<el-form-item prop="user_pwd">
					<el-input v-model="model.user_pwd" class="input-box" show-password prefix-icon="el-icon-info" placeholder="请输入密码"></el-input>
				</el-form-item>
			</el-form>
			<el-footer height="auto">
				<el-button @click="login">
					登录
				</el-button>
			</el-footer>
		</el-main>
	</el-container>
</template>

<script type="text/ecmascript-6">
        export default {
                name: 'Login',
	        data() {
                        return {
				model: { user_name: '', user_pwd: '' },
	                        rules: {
				        user_name: [
					        { required: true, message: '* 用户名不能为空', trigger: 'blur' },
					        { min: 2, max: 20, message: '* 用户名长度为2 - 20', trigger: 'blur' }
				        ],
		                        user_pwd: [
			                        { required: true, message: '* 密码不能为空', trigger: 'blur' },
			                        { min: 2, max: 20, message: '* 密码长度为2 - 20', trigger: 'blur' }
		                        ]
	                        }
                        }
	        },
	        methods: {
			async login() {
			        // 有await必有async，有async不一定要出现await
				// await 如果等来的是一个失败的promise ，会报异常
				// 所以官方建议，尽量将await放在try块中进行执行
				// 如果你确定这个异常不影响你的运行，你可以不管
				await this.$refs.form.validate();
				let token = await this.$http({ url: '/user/login', method: 'post', data: this.model })
			        sessionStorage.setItem('token', token);
			        sessionStorage.setItem('name', this.model.user_name);
			        this.$message({message: '登录成功！', type:'success'});
			        this.$router.replace('/home');
			}
	        }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.input-box >>> .el-input__inner
		height 50px
	.input-box >>> .el-input__icon
		line-height 50px
		font-size 16px
	.el-container
		height 100%
		display flex
		justify-content center
		align-items center
		background-color #E8E9E9
		background-image url('./bg22.jpg')
		background-repeat no-repeat
		background-position:center center;
		background-size 100% auto
		.el-main
			max-width 500px
			min-width 300px
			background-color rgba(255,255,255,0.7)
			border-radius 20px
			box-shadow 0 0 10px #ccc
			padding 0 50px 30px 50px
			box-sizing border-box
			.el-header
				text-align center
				padding 20px 0
				.el-button
					padding 20px
					font-size 60px
					background-color #fff
					color #0FA9B5
				h5
					font-size 20px
					margin 10px 0
					color #333
					font-weight 600
			.el-footer
				padding 20px 0
				text-align center
				.el-button
					width 100%
					background-color #0FA9B5
					color #fff
					height 50px
</style>