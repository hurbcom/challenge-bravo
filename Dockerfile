# basic dockerfile - subject to heavy changes - maybe swap for docker-compose
FROM python:3.10.0rc1-alpine3.14
COPY src /bin/api_src
COPY requirements.txt /bin/api_src/requirements.txt
COPY root /var/spool/cron/crontabs/root
RUN chmod +x /bin/api_src/cache_service.py
RUN pip3 install -r /bin/api_src/requirements.txt
CMD cron -l 2 -f