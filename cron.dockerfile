FROM alpine:latest
COPY root /var/spool/cron/crontabs/root
RUN apk update && apk add curl
CMD crond -l 2 -f 