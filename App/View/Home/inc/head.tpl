<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title><%=title%></title>
<script><% include ../../../../www/static/dist/cache/base.js %></script>

<%if (!css_global_s){ %>
    <style id="css_global_s">
        <% include ../../../../www/static/dist/ui/global.css %>
    </style>
    <script>
        cache.set('css_global_s');
    </script>
<%}else{%>
    <script>
        cache.get('css_global_s', 'css');
    </script>
<%}%>

<%if (!css_hljs_s){ %>
    <style id="css_hljs_s">
        <% include ../../../../www/static/res/hljs/hljs.css %>
    </style>
    <script>
        cache.set('css_hljs_s');
    </script>
<%}else{%>
    <script>
        cache.get('css_hljs_s', 'css');
    </script>
<%}%>

<meta name="keywords" content="<%=keywords%>" />
<meta name="description" content="<%=description%>" />