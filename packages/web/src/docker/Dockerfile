FROM node:12.13.1-alpine3.10

WORKDIR /tmp/app

COPY package.json .
RUN npm install
COPY . /tmp/app
RUN SKIP_PREFLIGHT_CHECK=true npm run build

FROM nginx:1.17.6-alpine

RUN apk add --no-cache \
  nginx \
  tini

ARG PLATFORM=web

COPY .docker/entrypoint.sh /usr/local/sbin/entrypoint.sh
COPY .docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /tmp/app/dist/${PLATFORM} /opt/app

RUN chmod +x /usr/local/sbin/entrypoint.sh

WORKDIR /opt/app

EXPOSE 3000

ENTRYPOINT ["tini", "--", "/usr/local/sbin/entrypoint.sh"]

ARG IMAGE=""
ARG  MAINTAINER=""

LABEL image="${IMAGE}" \
  maintainer="${MAINTAINER}" \
  base=alpine:3.10
