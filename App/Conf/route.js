/**
 * 自定义路由
 * @type {Object}
 */
module.exports = [
	[/^list\/([a-zA-Z]+)\/(\d+)$/, 'index/list/?url=:1&page=:2'],//列表有分页
	[/^list\/([a-zA-Z]+)$/, 'index/list/?url=:1'],//列表无分页

    [/^html\/([a-zA-Z0-9\-\_]+)$/, 'index/view/?url=:1'],//详情页
	

	[/^search\/([^\/]+)(?:\/(\d+))?$/, 'index/search/?key=:1&page=:2'],//搜索列表

	// [/^search\/(.*)\/(\d+)?$/, 'index/search/?key=:1&page=:2'],//搜索有分页
	// [/^search\/(.*)$/, 'index/search/?key=:1'],//搜索无分页

	
	[/^tag\/([^\/]+)(?:\/(\d+))?$/, 'index/tag_list/?url=:1&page=:2'],//标签列表
	[/^tag$/, 'index/tag/'],//标签主页
	
]