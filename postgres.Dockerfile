FROM postgres
WORKDIR /docker-entrypoint-initdb.d
ADD ./sql/tweet.sql /docker-entrypoint-initdb.d
EXPOSE 5432