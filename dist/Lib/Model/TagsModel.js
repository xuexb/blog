/*xuexb_blog - v0.1.3 - 2014-12-25  23:12:36*/
module.exports=Model(function(){"use strict";return{get:function(a){var b,c=this;return a=extend({page:1,limit:10,order:"id DESC",isPage:!1,cache:!1,where:null,field:"id, name, create_date, update_date, hit, url",one:!1},a||{}),b=c.field(a.field),a.one||("all"!==a.limit&&b.page(a.page,a.limit),b.order(a.order)),a.where&&b.where(a.where),a.cache&&b.cache(!0),a.isPage?b.countSelect({},!1):a.one?b.find():b.select()}}});