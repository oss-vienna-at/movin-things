#!/usr/bin/env bash

cd "$(dirname "$(dirname "$0")")"

./build/init_dev_env_vienna.sh

exit $?
