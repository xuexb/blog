/*xuexb_blog - v0.0.1 - 2015-05-21  16:05:51*/
"use strict";var App={};App.allAction=function(){var a=this,b=parseInt(a.get("page"),10)||1;return a.__get_list({isPage:!0,page:b}).then(function(b){return a.assign({list:b.data,page:b.count>0?get_page(b,Url.article.all("{$page}")):"",title:"全部文章_学习吧"}),a.display()})},App.indexAction=function(){var a=this;return a.__get_list({limit:10}).then(function(b){return a.assign("links",!0),a.assign({list:b,title:"学习吧 - 专注计算机基础知识和WEB前端开发"}),a.display()})},App.tag_listAction=function(){var a=this;return a.display()},App.tagsAction=function(){var a=this;return D("Tags").get({cache:!0,field:"url, id, name"}).then(function(a){var b;return isEmpty(a)?a:(b=[],a.forEach(function(a){b.push(D("TagsIndex").where({article_id:a.id}).count("article_id"))}),Promise.all(b).then(function(b){return a.forEach(function(a,c){a.count=b[c]}),a}))}).then(function(b){return a.assign("tags_data",b),a.assign("title","标签_学习吧"),a.__set_nav("tags"),a.display()})},App.searchAction=function(){var a=this,b=a.get("key").trim(),c=parseInt(a.get("page"),10)||1;return b?a.__get_list({where:{title:["like","%"+b+"%"]},isPage:!0,page:c}).then(function(a){var d=new RegExp(b,"gi");return a.data.forEach(function(a){a.title&&(a.title=a.title.replace(d,function(a){return"<mark>"+a+"</mark>"}))}),a.count>0&&1===c?D("Search").thenAdd({name:b,hit:0},{name:b},!0).then(function(b){return D("Search").where({id:b.id}).updateInc("hit").then(function(){return a})}):a}).then(function(c){return a.assign({list:c.data,key:b,page:c.count>0?get_page(c,Url.article.search(b,"{$page}")):"",title:"搜索 "+b+" 的结果_学习吧"}),a.display()}):a.__404Action()},App.listAction=function(){var a=this,b=a.get("url"),c=parseInt(a.get("page"),10)||1;return b?D("List").get({one:1,where:{url:b},field:"id, name, url"}).then(function(b){return isEmpty(b)?a.__404Action():a.__get_list({where:{list_id:b.id},isPage:!0,page:c}).then(function(c){return a.__set_nav("article",b.id),a.assign({list_data:b,list:c.data,page:c.count>0?get_page(c,Url.article.list(b.id,b.url,"{$page}")):"",title:b.name+"_学习吧"}),a.display()})}):a.__404Action()},App.viewAction=function(){var a,b=this,c={},d=b.get("url");return d?(parseInt(d,10)?c.id=parseInt(d,10):c.url=d,c.id||c.url?(a=b.referer(),a&&a.indexOf("search/")>0?(a=a.match(/search\/(.*?)\//)||["",""],a=decodeURIComponent(a[1])):a=null,D("Article").get({one:1,field:"id, markdown_content, hit, update_date, list_id, title, url, catalog",where:c}).then(function(c){var e;return isEmpty(c)?b.__404Action():(e=[D("List").get({one:1,field:"url, name, id",where:{id:c.list_id}}),D("TagsIndex").get({cache:!0,field:"tags_id",where:{article_id:c.id}})],a?e.push(D("Article").get({field:"id, title, url",limit:6,where:{id:["!=",c.id],title:["like","%"+a+"%"]}})):e.push(D("Article").get({field:"id, title, url",limit:6,order:"rand()",where:{id:["!=",c.id],list_id:c.list_id}})),e.push(D("Article").get({field:"id, title, url",one:1,limit:1,where:{id:c.id-1}}),D("Article").get({field:"id, title, url",one:1,limit:1,where:{id:c.id+1}})),e.push(D("Article").where({id:c.id}).updateInc("hit")),Promise.all(e).then(function(a){var b;return isEmpty(a[1])?a:(b=[],a[1].forEach(function(a){b.push(D("Tags").get({field:"id, name, url",where:{id:a.tags_id},one:!0}))}),Promise.all(b).then(function(b){return b.forEach(function(a){a.uri=Url.tags.list(a.id,a.url)}),a[1]=b,a}))}).then(function(e){var f;if(isEmpty(e)||isEmpty(e[0]))return b.__404Action();f=e[0],b.assign("tags_data",e[1]),b.assign("view_search",e[2]),b.assign("view_search_type",a?"search":"like"),a&&b.assign("key",a),b.assign("list_name",f.name),b.assign("list_url",f.url),b.assign("list_uri",Url.article.list(f.id,f.url)),c.update_date=Date.elapsedDate(c.update_date,"yyyy-M-d h:m");var g=parseInt(b.get("page"),10)||1,h=c.markdown_content.split(C("view_page")),i=h.length;1!==i&&(1>g?g=1:g>i&&(g=i),c.markdown_content=h[g-1],1!==g&&(c.markdown_content="<p><!-- start -->"+c.markdown_content),g!==i&&(c.markdown_content+="<!-- end --></p>")),b.assign("view_page",get_page({total:i,page:g},Url.article.view(c.id,c.url,"{$page}"))),c.catalog&&(1===g&&(c.catalog=c.catalog.replace(new RegExp("\\?page\\=1#","g"),"#")),c.markdown_content=c.catalog+c.markdown_content),b.assign("data",c);var j="article";return"xieliang"===d?j="about":"zaixianliuyan"===d&&(j="message"),b.__set_nav(j,f.id),b.assign("prev_article",isEmpty(e[3])?null:e[3]),b.assign("next_article",isEmpty(e[4])?null:e[4]),"article"===j?b.assign("title",c.title+"_"+f.name+"_学习吧"):b.assign("title",c.title+"_学习吧"),b.display()}))})):b.__404Action()):b.__404Action()},module.exports=Controller("Home/BaseController",function(){return App});