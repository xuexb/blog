<% if(list && list.length){ %>
<ul class="article-list">
    <% list.forEach(function(val){ %>
        <li>
            <h2 class="article-list-title text-overflow">
                <a href="<%=val.uri%>"><%=val.title%></a>
            </h2>
            <div class="article-list-content">
                <div class="markdown-body">
                    <%=val.content%>
                </div>
            </div>
            <div class="article-list-more">
                <a href="<%=val.uri%>">阅读全文 »</a>
            </div>
            <div class="article-list-tool clear">
                <ul class="fr">
                    <li>
                        <a href="<%=val.user_uri%>"><%=val.nickname%></a>
                    </li>
                    <li>
                        <i class="article-list-tool-hit"></i><%=val.hit%>
                    </li>
                    <li>
                        <i class="article-list-tool-time"></i><%=val.create_date%>
                    </li>
                    <li>
                        <i class="article-list-tool-class"></i>
                        <a href="<%=val.list_uri%>">
                            <%=val.list_name%>
                        </a>
                    </li>
                    <% if(val.tags_data && val.tags_data.length){ %>
                        <li>
                            <i class="article-list-tool-tag"></i>
                            <% val.tags_data.forEach(function(tags_val){ %>
                                <a href="<%=tags_val.uri%>"><%=tags_val.name%></a>
                            <% }); %>
                        </li>
                    <% } %>
                </ul>
            </div>
        </li>
    <% }); %>
</ul>
<% }else{ %>
    <div class="ui-empty">
        没有数据！
    </div>
<% } %>