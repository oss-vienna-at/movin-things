# Orion proxy

This is an apache forward proxy using a client certificate. Create a proper unencrypted 
certificate with RSA-formatted key included. The following script creates such a file from
a PKCS12 file:

```
#!/bin/env bash

P12=$1

if [ "x${P12}x" = "xx" -o ! -f "${P12}" ] ; then
echo "usage: $0: <client-cert.p12>"
exit 1
fi

read -r -s -p "certificate password: "
PW=${REPLY}
echo
PW_FILE=pw.txt
echo "${PW}" > ${PW_FILE}

STEM=`basename ${P12} .p12`

mkdir -p out/{certs,private}

openssl pkcs12 -in ${P12} -password file:${PW_FILE} -out out/certs/${STEM}_cert.pem -clcerts -nokeys
openssl pkcs12 -in ${P12} -password file:${PW_FILE} -out out/private/${STEM}_key.pem -nocerts -nodes
openssl rsa    -in out/private/${STEM}_key.pem -out out/private/${STEM}_rsakey.pem
cat out/private/${STEM}_rsakey.pem >> out/certs/${STEM}_cert.pem
rm -f out/private/${STEM}_*

rm -f ${PW_FILE}

tree out

exit 1
```

Put the result into `./orion-proxy/conf/ssl.crt/proxy.pem`

In order to start with proxy, use 

```
docker-compose -f docker-compose.yml -f docker-compose-orion-proxy.yml up --build
```

The proxy targets our internal Orion. It is not available from outside our firewall.