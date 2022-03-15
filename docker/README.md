# Docker 运行、部署

### 1. 构建 Node.js 镜像

构建出 Node.js 运行时镜像：

- 镜像名称：`xuexb/blog` 必须的，因为在下个镜像还需要使用该名称复制文件
- 镜像版本：`node-latest` 必须的，因为在下个镜像还需要使用该版本复制文件，也可以构建多个版本，如：
    - `xuexb/blog:node-5.0.0`
    - `xuexb/blog:node-latest`
- 运行时端口：`8360` 必须的，因为在下个镜像还需要该端口进行反向代理

```bash
docker build -t xuexb/blog:node-latest -f docker/Dockerfile .
```

程序默认使用【前端小武博客】开发测试环境的数据库，也可以变量配置：

```bash
docker run --name blog-node \
    -p 8360:8360 \
    --rm \
    -it \
    -e DB_HOST=数据库连接地址 \
    -e DB_PORT=数据库连接端口 \
    -e DB_DATABASE=数据库名称 \
    -e DB_USER=数据库用户名 \
    -e DB_PASSWORD=数据库密码 \
    -e DB_PREFIX=表名称前缀 \
    xuexb/blog:node-latest
```

默认生成 Node.js 镜像可以独立运行，跟 Nginx 镜像配合更优，对比如下：

| case | Node.js 镜像独立运行 | Node.js + Nginx |
| --- | --- | --- |
| 镜像名称 | 可随意 | `xuexb/blog` |
| 镜像版本 | 可随意 | 必须存在一个 `node-latest` |
| Node.js 运行时端口 | 可随意，如： `-e PORT=8080` | `8360` |
| 浏览器缓存 | 未配置 | Nginx 镜像配置：<ul><li>404 不缓存</li><li>HTML 浏览器10分钟、CDN 7天</li><li>静态资源最大缓存</li></ul> |
| 数据库配置 | 支持 | 支持 |

### 2. 构建 Nginx 镜像

Node.js 镜像提供了完整的独立运行文件，包括：后端、静态文件等，但不太文件配置文件缓存、跨域配置、Gzip 压缩等策略，当构建 Node.js 镜像后支持再基于 Node.js 镜像内的静态文件再构建一个 Nginx 镜像。

- 镜像名称：随意
- 镜像版本：随意
- 运行时端口：`8080`

```bash
docker build -t xuexb/blog:nginx-latest -f docker/Dockerfile.nginx .
```

### 3. 运行

独立运行 Node.js 程序：

```bash
docker run -p 8360:8360 --name blog-node --rm -it xuexb/blog:node-latest
```

代理模式运行：

```bash
# 先运行 Node.js 程序
# 代理模式运行时，Node.js 程序就不需要暴露端口了
docker run --name blog-node --rm -it xuexb/blog:node-latest

# 把 `blog-node` 链接到 Nginx 容器，且名称为 `blog`
docker run \
    -p 8080:8080 \
    -it \
    --name blog-nginx \
    --rm \
    --link blog-node:blog \
    xuexb/blog:nginx-latest
```