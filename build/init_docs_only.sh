#!/usr/bin/env bash

cd "$(dirname "$(dirname "$0")")"

rm -f docker-compose.yml
ln -s docker-compose-docs-only.yml docker-compose.yml

exit $?
