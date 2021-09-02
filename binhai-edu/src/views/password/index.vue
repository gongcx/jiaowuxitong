<template>
	<div>
		<el-form label-width="80px" status-icon :model="pwd" :rules="rules" ref="form">
			<el-form-item label="旧密码" prop="oldPwd">
				<el-input type="password" v-model="pwd.oldPwd" show-password></el-input>
			</el-form-item>
			<el-form-item label="新密码" prop="newPwd">
				<el-input type="password" v-model="pwd.newPwd" show-password></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="checkPwd">
				<el-input type="password" v-model="pwd.checkPwd" show-password></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="save">确认</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script type="text/ecmascript-6">
        export default {
                name: 'Password',
	        data() {
			return {
			        pwd: {
                                        oldPwd: '',
                                        newPwd: '',
                                        checkPwd:''
			        },
				rules: {
			                oldPwd: [
                                                {
                                                        validator: (rule, value, next) => {
                                                                if(value.length === 0)
                                                                        next(new Error('* 旧密码不能为空'));
                                                                else if(value.length < 3 || value.length > 50)
                                                                        next(new Error('* 旧密码长度3 - 16位'));
                                                                else
                                                                        next();
                                                        },
                                                        trigger:'blur'
                                                }
			                ],
					newPwd: [
						{
                                                        validator: (rule, value, next) => {
                                                                if(value.length === 0)
                                                                        next(new Error('* 新密码不能为空'));
                                                                else if(value.length < 3 || value.length > 50)
                                                                        next(new Error('* 新密码长度3 - 16位'));
                                                                else
                                                                        next();
                                                        },
                                                        trigger:'blur'
						}
					],
					checkPwd: [
                                                {
                                                        validator: (rule, value, next) => {
                                                                if(value.length === 0)
                                                                        next(new Error('* 确认密码不能为空'));
                                                                else if(value !== this.pwd.newPwd)
                                                                        next(new Error('* 两次输入密码不一致'));
                                                                else
                                                                        next();
                                                        },
                                                        trigger:'blur'
                                                }
					]
				}

			}
	        },
	        methods: {
                        async save() {
                                await this.$refs.form.validate();
                                let tip = await this.$http({url: '/user/pwdchange', method: 'post', data: {...this.pwd}});
                                if(!tip){
                                        this.$message({message: '密码修改成功，请重新登录！',type: 'success'});
                                        this.$router.replace('/login');
                                }


                        }
	        }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.el-form
		width 400px
</style>