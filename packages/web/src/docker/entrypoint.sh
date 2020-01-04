#!/bin/sh

mkdir -p /etc/confd/conf.d
for i in `find . -type f -name "*.js"`; do
  src=${i#?}.tmpl
  dest=$i
  template=/etc/confd/templates$src
  mkdir -p $template && rm -r $template
  mv $dest $template
  cat <<EOF > /etc/confd/conf.d/app.toml
[template]
src = "$src"
dest = "$dest"
EOF
confd -onetime -backend env
done
sh /usr/local/sbin/prepare
echo "port listening on 3000"

exec /usr/sbin/nginx -g "daemon off;$@"
