#!/usr/bin/env bash

cd "$(dirname "$(dirname "$0")")"

(
  cd ./src/
  rm -f index.html
  ln -s index_vienna.html index.html
)
exit $?
