<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title><%=title%></title>
<script type="text/javascript" src="<%=C('dist')('cache/base.js')%>"></script>

<%if (!css_global){ %>
    <style id="css_global">
        <% include ../../../../www/static/dist/ui/global.css %>
    </style>
    <script>
        cache.set('css_global');
    </script>
<%}else{%>
    <script>
        cache.get('css_global', 'css');
    </script>
<%}%>

<%if (!css_hljs){ %>
    <style id="css_hljs">
        <% include ../../../../www/static/res/hljs/hljs.css %>
    </style>
    <script>
        cache.set('css_hljs');
    </script>
<%}else{%>
    <script>
        cache.get('css_hljs', 'css');
    </script>
<%}%>

<meta name="keywords" content="<%=keywords%>" />
<meta name="description" content="<%=description%>" />