FROM node:10-alpine AS builder

WORKDIR /root/app
COPY yarn.lock .
COPY package.json .
RUN yarn
COPY . .
RUN ls -lah
RUN yarn build

FROM node:10-alpine
LABEL maintainer="xuexb <fe.xiaowu@gmail.com>"
ENV PORT=8080
WORKDIR /root/app
COPY --from=builder /root/app/output .
RUN yarn install --production
RUN yarn cache clean
EXPOSE 8080
CMD [ "node", "www/production.js" ]