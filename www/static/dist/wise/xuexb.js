/*blog-static - v0.0.2 - 2015-12-18 19:12:03*/
!function(){"use strict";var a=!1,b=1,c=!1,d=function(d){a||c||("append"===d?b+=1:b=1,a=!0,$.ajax({type:"POST",data:{page:b},dataType:"json",complete:function(){a=!1,$.hideIndicator()},success:function(a){var b;return a&&a.data&&a.data.length?(b="",$.each(a.data,function(a,c){b+='<li class="item-content">',b+='<div class="item-inner">',b+='<a class="item-title" href="/html/'+(c.url||c.id)+'.html">'+c.title+"</a>",b+="</div>",b+="</li>"}),"append"!==d&&$(".list-container").empty(),$(".list-container").append(b),void $.refreshScroller()):($.detachInfiniteScroll(".infinite-scroll"),$.attachInfiniteScroll(".infinite-scroll"),$(".infinite-scroll-preloader").remove(),void(c=!0))},error:function(){$.toast("加载失败")}}))};$(document).on("infinite",".infinite-scroll",function(){d("append")}),$(document).on("refresh",".pull-to-refresh-content",function(a){$.showIndicator(),setTimeout(function(){c=!1,d(),$.pullToRefreshDone(".pull-to-refresh-content")},1e3)}),$(window).on("load",function(){$("#J-form").on("submit",function(){var a=$("#J-search").val().trim();return a&&($.router.loadPage("?key="+a),$("#J-search").blur()),!1})})}(),$.init();