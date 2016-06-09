#!/bin/bash

[ -d log ] || mkdir log
nohup node $1 >> log/$1-start.log &

