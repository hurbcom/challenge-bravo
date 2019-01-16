FROM ubuntu:bionic

RUN apt update && \
    apt install wget build-essential cmake git openssl libcpprest-dev libboost-log1.65-dev libboost-program-options1.65-dev sqlite3 libsqlite3-dev -y


RUN cd /tmp && \
    wget -qO- https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/5.2.4/flyway-commandline-5.2.4-linux-x64.tar.gz | tar xvz && \
    ln -s `pwd`/flyway-5.2.4/flyway /usr/local/bin

#RUN flyway -locations=filesystem:/tmp/db/migrations/sql/ -url=jdbc:sqlite:/tmp/microservice.db -user= -password=  migrate

RUN cd /tmp && \
    git clone git://github.com/SOCI/soci.git && \
    mkdir soci/build && \
    cd soci/build && \
    cmake -DWITH_SQLITE3=ON .. && \
    make -j4 && \
    make install

COPY db /tmp/db
COPY src /tmp/src
COPY cmake /tmp/cmake

RUN ls /tmp

RUN mkdir /tmp/src/build && \
    cd /tmp/src/build && \
    cmake .. && \
    make -j4

COPY docker/run.sh /tmp/

EXPOSE 6502

ENTRYPOINT ["/tmp/run.sh"]

CMD tail -f /dev/null
