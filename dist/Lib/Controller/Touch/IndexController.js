"use strict";var App={};App.allAction=function(){return App.indexAction.call(this)},App.indexAction=function(){var a=this;return a.display(VIEW_PATH+"/Touch/index_index.html")},App.tag_listAction=function(){return App.indexAction.call(this)},App.tagsAction=function(){return App.indexAction.call(this)},App.searchAction=function(){var a=this,b=a.get("key").trim();return a.assign("title","搜索 "+b+" 的结果——前端小武"),a.assign("key",b),App.indexAction.call(this)},App.listAction=function(){var a=this,b=a.get("url");return D("List").get({one:1,where:{url:b},field:"id, name, url"}).then(function(c){var d,e;return isEmpty(c)?a.__404Action():(a.assign("nav_list_id",c.id),a.assign("nav_list_name",c.name),"wangzhanbiancheng"===b?d="前端小武 谢耀武 前端开发":"nodejs"===b?(d="前端小武 谢耀武 前端开发 nodejs",e="Node是一个Javascript运行环境(runtime)。"):"qianduankaifa"===b?(d="前端小武 谢耀武 前端开发",e="Web前端开发是一项很特殊的工作，涵盖的知识面非常广，既有具体的技术，又有抽象的理念。"):"diannaozhishi"===b?(d="前端小武 谢耀武 计算机基础",e="前端开发必须掌握的一些计算机基础知识。"):"jishiben"===b&&(d="前端小武 谢耀武 前端故事"),d&&a.assign("keywords",d),e&&a.assign("description",e),a.assign("title",c.name+"——前端小武"),App.indexAction.call(a))})},App.viewAction=function(){var a=this,b={},c=a.get("url");if(!c)return a.__404Action();if(isFinite(c))b.id=parseInt(c,10);else{if("xieliang"===c)return a.redirect("/html/xiaowu.html",301);b.url=c}return b.id||b.url?D("Article").get({one:1,field:"id, markdown_content, hit, update_date, list_id, title, url, catalog",where:b}).then(function(b){var d;return isEmpty(b)?a.__404Action():(d=[D("List").get({one:1,field:"url, name, id",where:{id:b.list_id}})],d.push(D("Article").where({id:b.id}).updateInc("hit")),Promise.all(d).then(function(d){var e;return isEmpty(d)||isEmpty(d[0])?a.__404Action():(e=d[0],a.assign("list_name",e.name),a.assign("list_url",e.url),a.assign("list_uri",Url.article.list(e.id,e.url)),b.update_date=Date.elapsedDate(b.update_date,"yyyy-M-d h:m"),b.markdown_content=b.markdown_content.replace(new RegExp(C("view_page"),"g"),"").replace(new RegExp(C("list_mark"),"g"),""),b.markdown_content=b.markdown_content.replace(/http\:\/\/(www|github)\.xuexb(.+?)\.(jpg|git|jpeg|png)$/g,function(a){return a.replace("http:","https:")}),a.assign("data",b),a.assign("description",b.markdown_content.replace(/<[^>]+?>/g,"").replace(/[\r\n]/g,",").substr(0,120)+"..."),"xiaowu"!==c&&"links"!==c&&"zaixianliuyan"!==c?a.assign("title",b.title+"_"+e.name+"_前端小武"):a.assign("title",b.title+"——前端小武"),a.display())}))}):a.__404Action()},module.exports=Controller("Touch/BaseController",function(){return App});