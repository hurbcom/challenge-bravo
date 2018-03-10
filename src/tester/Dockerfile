FROM ubuntu
RUN mkdir /scripts
WORKDIR /scripts
RUN apt-get update
RUN apt-get install -y cmake make git build-essential libboost-all-dev openssl libcpprest-dev lua-curl-dev
RUN git clone https://github.com/giltene/wrk2.git && cd wrk2 && make && cp wrk /usr/bin && cd ..
