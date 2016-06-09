#!/bin/bash

[ -d log ] || mkdir log
nohup node admin >> log/admin-start.log &

