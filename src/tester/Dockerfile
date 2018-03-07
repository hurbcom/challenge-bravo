FROM ubuntu
RUN apt update
RUN apt install -y cmake make git build-essential libboost-all-dev openssl libcpprest-dev lua-curl-dev
RUN git clone https://github.com/giltene/wrk2.git && cd wrk2 && make && cp wrk /usr/bin && cd ..
CMD ["/usr/bin/wrk","-t9","-c1000","-R13000","-d30s","http://localhost:3333/go_api/?from=usd&to=brl&amount=200"]