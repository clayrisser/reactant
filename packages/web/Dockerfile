FROM node:12.13.1-alpine3.10

ARG IMAGE=""
ARG MAINTAINER=""

LABEL image="${IMAGE}" \
  maintainer="${MAINTAINER}" \
  base=alpine:3.10

WORKDIR /opt/app

EXPOSE 3000

ENTRYPOINT ["node", "/opt/app"]
