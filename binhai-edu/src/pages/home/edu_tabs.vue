<template>
	<el-tabs
		:value="$store.state.home.activeTab"
		@tab-click="tab => $store.commit('home/tabToggle',tab.name)"
	         type="card" closable
	         @tab-remove="name => $store.commit('home/tabRemove',name)">
		<el-tab-pane
			v-for="item in $store.state.home.tabs"
			:key="item" :label="$store.state.home.menu.find(func => func.func_key === item).func_name"
			:name="item">
			<component :is="$store.state.funcsMap[item].component"></component>
		</el-tab-pane>
	</el-tabs>
</template>

<script type="text/ecmascript-6">
        export default {
                name: 'EduTabs'
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.el-tabs
		display flex
		flex-direction column
		overflow hidden
		.el-tabs__header
			flex-shrink 0
		.el-tabs__content
			flex-grow 1
			overflow auto
	.el-tab-pane
		padding 10px
		height 100%
		overflow auto
</style>