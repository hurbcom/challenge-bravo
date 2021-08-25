# setup
FROM python:3.10.0rc1-alpine3.14
# file copy
COPY root /var/spool/cron/crontabs/root
COPY cache_updater.py /bin/cache_updater.py
COPY cache_updater_config.py /bin/cache_updater_config.py
# deps install
RUN pip3 install redis requests
# execution
CMD python3 /bin/cache_updater.py && crond -l 2 -f