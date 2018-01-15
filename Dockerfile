FROM ubuntu
RUN apt update
RUN apt install -y cmake git build-essential libboost-all-dev openssl libcpprest-dev
RUN git clone https://github.com/Cylix/tacopie.git && cd tacopie && mkdir build && cd build && cmake .. && make && make install && cd ../..
RUN git clone https://github.com/Cylix/cpp_redis.git && cd cpp_redis && git submodule init && git submodule update && mkdir build && cd build && cmake .. -DCMAKE_BUILD_TYPE=Release && make && make install && cd ../..
ADD src src
RUN cd src && mkdir build && cd build && cmake .. && make
CMD sleep 5 && /src/build/currency-conversion-service
