<div class="bar">
    <div class="w clear">
        <div class="bar-logo fl">
            <h1>
                <a href="/">学习吧</a>
            </h1>
        </div>

        <ul class="bar-nav fr clear">
            <li>
                <a href="#"<% if(nav_type === 'home'){ %> class="current"<% } %>>首页</a>
            </li>
            <li>
                <span<% if(nav_type === 'article'){ %> class="current"<% } %>>文章</span>
                <div class="bar-nav-dropdown">
                    <% (LIST || []).forEach(function(val){ %>
                        <a href="<%=val.uri%>" <%if(nav_list_id && nav_list_id === val.id){ %> class="current"<% } %>><%=val.name%></a>
                    <% }); %>
                </div>
            </li>
            <li>
                <a href="#">Demo</a>
            </li>
            <li>
                <a href="#"<% if(nav_type === 'tags'){ %> class="current"<% } %>>标签</a>
            </li>
            <li>
                <a href="#"<% if(nav_type === 'about'){ %> class="current"<% } %>>关于我</a>
            </li>
            <li>
                <a href="#"<% if(nav_type === 'message'){ %> class="current"<% } %>>留言</a>
            </li>
            <li>
                <div class="bar-nav-rss">
                    <a href="#">RSS</a>
                </div>
            </li>
        </ul>
    </div>
</div>