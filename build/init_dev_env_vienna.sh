#!/usr/bin/env bash

cd "$(dirname "$(dirname "$0")")"

bash ./api/bin/init_dev_env_vienna.sh
bash ./demo/bin/init_dev_env_vienna.sh

if [ ! -z "${DSC_RUNNING_ON_CI_SERVER}" ] ; then
  # We have no cert in repo, but orion-proxy needs one to start up
  # Use fake. Removed at end of ci_test/test.sh
  cp ./build/apache_proxy.pem ./api/proxy.env
fi

rm -f docker-compose.yml
ln -s docker-compose-vienna.yml docker-compose.yml

exit $?
