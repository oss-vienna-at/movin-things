#!/usr/bin/env bash

if [ ! -z "${DSC_RUNNING_ON_CI_SERVER}" ] ; then
  set -x
fi

. api/process.env

EXIT_CODE=0
for URL in \
    http://127.0.0.1:${CLIENT_PORT}/v1/get_configurations/ \
; do
    echo "### ${URL}"
    curl -si -H "x-pvp-roles: tenant(name=pace,name=profirator)" ${URL} | head -1 | grep 'HTTP/1.1 200'
    EXIT_CODE=$(expr ${EXIT_CODE} + $?)
    if [[ ${EXIT_CODE} -gt 0 ]] ; then
        echo "Calling ${URL} failed!"
    fi
    echo
done

if [[ ${EXIT_CODE} -eq 0 ]] ; then
    echo "### SUCCESS"
else
    docker-compose logs
    echo "### FAILURE"
fi

if [ ! -z "${DSC_RUNNING_ON_CI_SERVER}" ] ; then
  # We have no cert in repo, but orion-proxy needs one to start up
  # Created by ./build/init_dev_env_vienna.sh
  rm -f ./api/proxy.env
fi

exit "${EXIT_CODE}"