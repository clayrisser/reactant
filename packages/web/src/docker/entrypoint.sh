#!/bin/sh

echo "port listening on 3000"
exec /usr/sbin/nginx -g "daemon off;$@"
