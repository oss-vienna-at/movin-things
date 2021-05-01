#!/usr/bin/env bash

cd "$(dirname "$(dirname "$0")")"

(
  cd ./src/
  rm -f config
  ln -s config_profirator config
)

if [ ! -f proxy.env ] ; then
  touch proxy.env
fi

exit $?
