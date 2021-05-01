#!/usr/bin/env bash

cd "$(dirname "$(dirname "$0")")"

bash ./api/bin/init_dev_env_profirator.sh
bash ./demo/bin/init_dev_env_profirator.sh

rm -f docker-compose.yml
ln -s docker-compose-profirator.yml docker-compose.yml

exit $?
