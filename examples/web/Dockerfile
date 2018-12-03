FROM alpine:node

WORKDIR /tmp/app

RUN apk add --no-cache \
      nginx \
      tini && \
    apk add --no-cache --virtual build-deps \
      build-tools \
      curl

RUN curl -L -o /etc/nginx/nginx.conf https://github.com/nginx/nginx.conf

COPY . .

RUN mv docker/entrypoint.sh /usr/sbin && \
    mv docker/nginx.conf /etc/nginx/conf.d/default.conf && \
    yarn && \
    yarn build && \
    mv dist/web /opt/app && \
    mv package.json yarn.lock node_modules /opt/app

WORKDIR /opt/app

RUN yarn && \
    rm -rf /tmp/app && \
    apk clean build-deps

ENTRYPOINT ["/usr/sbin/tini", "--", "/bin/sh", "/usr/sbin/entrypoint.sh"]
