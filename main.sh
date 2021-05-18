#!/bin/sh
redis-server --requirepass Ch4ll5ngeBr@vo%# --daemonize yes > /usr/app/hurby/redis.log \
&& pipenv run python main.py