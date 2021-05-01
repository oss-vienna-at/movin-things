#!/usr/bin/env bash

cd "$(dirname "$(dirname "$0")")"

bash ./api/bin/init_dev_env_vienna.sh
bash ./demo/bin/init_dev_env_vienna.sh

ln -s docker-compose-vienna.yml docker-compose.yml

exit $?
