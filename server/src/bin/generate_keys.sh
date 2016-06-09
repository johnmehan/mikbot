#!/bin/sh

if [ $# -eq 1 ]; then
  DEST=$1/
  mkdir -p ${DEST}
fi

SERVER_KEY=${DEST}server_key.pem
SERVER_PRIVATE_KEY=${DEST}server_privKey.pem
SERVER_PUBLIC_KEY=${DEST}server_pubKey.pem

APP_KEY=${DEST}app_key.pem
APP_PRIVATE_KEY=${DEST}app_privKey.pem
APP_PUBLIC_KEY=${DEST}app_pubKey.pem

EC_CURVE_FLAGS='-name secp256r1'

BIN_DIR=`dirname "$0"`

openssl ecparam -genkey -conv_form uncompressed -out $SERVER_KEY $EC_CURVE_FLAGS
if [ $? -ne 0 ]; then exit 1; fi
openssl ec -in $SERVER_KEY -outform PEM -out $SERVER_PRIVATE_KEY
if [ $? -ne 0 ]; then exit 1; fi
openssl ec -in $SERVER_KEY -pubout -outform PEM -out $SERVER_PUBLIC_KEY
if [ $? -ne 0 ]; then exit 1; fi

$BIN_DIR/pem2raw.pl $SERVER_KEY
if [ $? -ne 0 ]; then exit 1; fi

openssl ecparam -genkey -conv_form uncompressed -out $APP_KEY $EC_CURVE_FLAGS
if [ $? -ne 0 ]; then exit 1; fi
openssl ec -in $APP_KEY -outform PEM -out $APP_PRIVATE_KEY
if [ $? -ne 0 ]; then exit 1; fi
openssl ec -in $APP_KEY -pubout -outform PEM -out $APP_PUBLIC_KEY
if [ $? -ne 0 ]; then exit 1; fi

