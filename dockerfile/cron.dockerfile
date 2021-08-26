# setup
FROM python:3.10.0rc1-alpine3.14
# file copy
COPY script/root /var/spool/cron/crontabs/root
COPY script/cache_updater.py /bin/cache_updater.py
COPY script/cache_updater_config.py /bin/cache_updater_config.py
# deps install
RUN pip3 install redis requests
# execution
CMD python3 /bin/cache_updater.py && crond -l 2 -f