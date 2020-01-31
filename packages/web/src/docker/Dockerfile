FROM node:12.13.1-alpine3.10

RUN apk add --no-cache \
  ${BUILD_PACKAGES}

WORKDIR /tmp/app

COPY package.json .
RUN sed -i 's/workspace://g' package.json && \
  npm install
COPY . /tmp/app
RUN SKIP_PREFLIGHT_CHECK=true npm run build

FROM nginx:1.17.6-alpine

ARG PACKAGES=""

RUN apk add --no-cache \
  nginx \
  tini \
  ${PACKAGES}
RUN wget -O /usr/local/bin/confd \
  https://github.com/kelseyhightower/confd/releases/download/v0.16.0/confd-0.16.0-linux-amd64 && \
  chmod +x /usr/local/bin/confd

ARG PLATFORM=web

COPY .docker/entrypoint.sh /usr/local/sbin/entrypoint
COPY .docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY .docker/prepare.sh /usr/local/sbin/prepare
COPY --from=0 /tmp/app/dist/${PLATFORM} /opt/app

RUN chmod +x /usr/local/sbin/entrypoint && \
  chmod +x /usr/local/sbin/prepare

WORKDIR /opt/app

EXPOSE 3000

ENTRYPOINT ["tini", "--", "sh", "/usr/local/sbin/entrypoint"]

ARG IMAGE=""
ARG MAINTAINER=""

LABEL image="${IMAGE}" \
  maintainer="${MAINTAINER}" \
  base=alpine:3.10
