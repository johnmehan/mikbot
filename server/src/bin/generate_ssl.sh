#!/bin/sh

if [ $# -eq 1 ]; then
  DEST=$1/
  mkdir -p ${DEST}
fi

KEY_FILE=${DEST}admin-key.pem
CERT_FILE=${DEST}admin-cert.pem
CSR_FILE=${DEST}admin-cert-request.csr

openssl genrsa -out $KEY_FILE 1024
openssl req -new -key $KEY_FILE -out $CSR_FILE
openssl x509 -req -in $CSR_FILE -signkey $KEY_FILE -out $CERT_FILE

