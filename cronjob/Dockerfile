FROM ubuntu:20.04

RUN apt update 
RUN apt -y install cron curl

RUN touch /var/log/cron.log

ADD crontab /etc/cron.d/crontab
RUN chmod 0644 /etc/cron.d/crontab

CMD cron && tail -f /var/log/cron.log