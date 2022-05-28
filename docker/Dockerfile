FROM node:12-alpine AS builder
WORKDIR /root/app
COPY yarn.lock .
COPY package.json .
RUN yarn
COPY . .
RUN ls -lah
RUN yarn build

FROM node:12-alpine
LABEL maintainer="xuexb <fe.xiaowu@gmail.com>"
LABEL org.opencontainers.image.source https://github.com/xuexb/blog
ENV LANG en_US.UTF-8
ENV TZ Asia/Shanghai
ENV PORT=8360
WORKDIR /root/app
COPY --from=builder /root/app/output .
RUN yarn install --production
RUN yarn cache clean
EXPOSE 8360
CMD [ "node", "www/production.js" ]