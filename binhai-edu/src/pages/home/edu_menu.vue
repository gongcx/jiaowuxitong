<template>
	<el-menu @select="index => $store.commit('home/tabAdd',index)"
	         background-color="#fff"
	         text-color="#000"
	         active-text-color="#0094ff"
	         :default-active="$store.state.home.activeTab">
		<template v-for="item in $store.state.home.menu.filter(item =>  item.func_fid === 0 )">
			<el-submenu v-if="item.func_key === ''" :index="item.func_id.toString()" :key="item.func_id">
				<template slot="title">
					<i class="el-icon-setting"></i>
					<span v-text="item.func_name"></span>
				</template>
				<el-menu-item v-for="item2 in $store.state.home.menu.filter(item3 => item3.func_fid === item.func_id)" :key="item2.func_id" :index="item2.func_key">
					<i class="el-icon-menu"></i>
					<span slot="title" v-text="item2.func_name"></span>
				</el-menu-item>
			</el-submenu>
			<el-menu-item v-else :key="item.func_id" :index="item.func_key">
				<i class="el-icon-menu"></i>
				<span slot="title" v-text="item.func_name"></span>
			</el-menu-item>
		</template>
	</el-menu>
</template>

<script type="text/ecmascript-6">
        export default {
                name: 'EduMenu',
	        created() {
                        this.$store.dispatch('home/init');
	        }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.el-submenu .el-menu-item
		padding-left 60px !important
</style>