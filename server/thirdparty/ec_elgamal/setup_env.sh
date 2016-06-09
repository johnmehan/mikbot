#!/bin/bash

if [[ $OSTYPE == linux* ]]; then
  if [ $UID -ne 0 ]; then
    echo 'This script must be run with root privileges!' 1>&2
    exit 1
  fi

  NODE_BIN_DIR=/opt/toolchain/nodejs/bin

  if [ ! -d "$NODE_BIN_DIR" ]; then
    echo "Missing Node.js 'bin' directory: $NODE_BIN_DIR" 1>&2
    exit 1
  fi

  PATH=${PATH}:$NODE_BIN_DIR
fi

echo 'Installing Node.js module for building addons'

npm install -g node-gyp
node-gyp install

