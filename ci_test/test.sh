#!/usr/bin/env bash

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
    echo "### FAILURE"
fi

exit "${EXIT_CODE}"