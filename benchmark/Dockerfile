FROM alpine:latest
RUN apk add --update alpine-sdk openssl-dev && apk add --no-cache git && git clone https://github.com/giltene/wrk2.git && cd wrk2 && make && mv wrk /bin/
WORKDIR /data