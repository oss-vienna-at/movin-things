#!/usr/bin/env bash

cd "$(dirname "$(dirname "$0")")"

(
  cd ./src/
  rm -f config
  ln -s config_profirator config
)

if [ ! -f proxy.env ] ; then
  cat <<_EOF
_EOF > proxy.env
fi

exit $?
