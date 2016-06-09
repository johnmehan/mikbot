#!/bin/bash

if [[ $# -ne 1 || ("$1" != admin && "$1" != server) ]]; then
  echo "Usage: $0 (admin|server)"
  exit 1
fi

nohup node $1 >> log/$1-start.log &

