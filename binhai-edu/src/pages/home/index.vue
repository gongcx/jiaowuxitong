<template>
	<el-container class="page-container">
		<el-header height="80px">
			<img src="./logo.png" alt="">
			<h1>青岛滨海学院教学管理系统 v1.0</h1>
			<div class="esc-login">
				<div class="logo">
					<img src="./logo.jpg" alt="">
				</div>
				<span v-text="name"></span>
				<el-button @click="esc" type="primary" v-if="name">
					退出登录
				</el-button>
			</div>
		</el-header>
		<el-container>
			<el-aside width="350px">
				<edu-menu></edu-menu>
			</el-aside>
			<el-container>
				<el-main>
					<edu-tabs></edu-tabs>
				</el-main>
				<el-footer height="45px"><p>&copy;版权所有: 青岛滨海学院 网址: https://www.kengni.com</p></el-footer>
			</el-container>
		</el-container>
	</el-container>
</template>

<script type="text/ecmascript-6">
	import EduMenu from './edu_menu.vue';
	import EduTabs from './edu_tabs.vue';
        export default {
                name: 'Home',
	        components: { 'edu-menu': EduMenu, 'edu-tabs': EduTabs },
	        data(){
			return {
				name: ''
			}
	        },
	        created(){
			this.name = sessionStorage.getItem('name');
	        },
                methods: {
			async esc() {
				await this.$confirm('确定要退出登录吗？','提示');
				sessionStorage.removeItem('name');
                                sessionStorage.removeItem('token');
                                this.$message({message:'退出登录成功！',type:'success'});
				this.$router.replace('/login');


                        }
                }
        }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.page-container
		overflow hidden
		height 100%
		width 100%
		.el-header
			display flex
			align-items center
			background-color #1877DA
			.esc-login
				height 100%
				padding-right 50px
				display flex
				align-items center
				.logo
					width 55px
					height 55px
					border-radius 50px
					overflow hidden
					margin-right 20px
					img
						width 100%
						height 100%
				span
					color #fff
					font-size 20px
					margin-right 20px
			img
				margin-right 30px
				height 80%
			h1
				color #fff
				font-weight 600
				font-size 24px
				flex-grow 1
		.el-aside
			background url(./bg3.jpg)
			background-size 100% 100%
		.el-container
			overflow hidden
		.el-footer
			display flex
			align-items center
			justify-content center
			background-color #1D6CD5
			color #fff

</style>