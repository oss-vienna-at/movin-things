#!/usr/bin/env bash

cd "$(dirname "$(dirname "$0")")"

(
  cd ./src/
  rm -f config
  ln -s config_vienna config
)

if [ ! -f proxy.env ] ; then
  (
  cat <<_EOF
http_proxy=http://uaproxy.wien.gv.at:3129/
https_proxy=http://uaproxy.wien.gv.at:3129/
HTTP_PROXY=http://uaproxy.wien.gv.at:3129/
HTTPS_PROXY=http://uaproxy.wien.gv.at:3129/
no_proxy=127.0.0.1,localhost,localaddress,.docker,.magwien.gv.at,.wien.gv.at
NO_PROXY=127.0.0.1,localhost,localaddress,.docker,.magwien.gv.at,.wien.gv.at
_EOF
 ) > proxy.env
fi

exit $?
