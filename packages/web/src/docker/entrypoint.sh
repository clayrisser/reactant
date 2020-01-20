#!/bin/sh

mkdir -p /etc/confd/conf.d
i=0
for value in `find . -type f -name "main.*.js"`; do
  src=${value#?}.tmpl
  dest=$value
  template=/etc/confd/templates$src
  mkdir -p $template && rm -r $template
  mv $dest $template
  cat <<EOF > /etc/confd/conf.d/$i.toml
[template]
src = "$src"
dest = "$dest"
EOF
  i=$((i=i+1))
done
confd -onetime -backend env

sh /usr/local/sbin/prepare
echo "port listening on 3000"

exec /usr/sbin/nginx -g "daemon off;$@"
