FROM shangxian/nginx:2.1-alpine3.9
LABEL maintainer="xuexb <fe.xiaowu@gmail.com>"
LABEL org.opencontainers.image.source https://github.com/xuexb/blog
ENV LANG en_US.UTF-8
ENV TZ Asia/Shanghai
WORKDIR /etc/nginx/app
COPY --from=xuexb/blog:node-latest /root/app/www /etc/nginx/app
COPY docker/nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080