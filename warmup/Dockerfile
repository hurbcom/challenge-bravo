FROM alpine:latest

RUN apk add --update alpine-sdk openssl-dev

ADD crontab.txt /crontab.txt
ADD run.sh /run.sh
COPY entrypoint.sh /entrypoint.sh
RUN chmod 755 /run.sh /entrypoint.sh
RUN /usr/bin/crontab /crontab.txt

CMD ["/entrypoint.sh"]