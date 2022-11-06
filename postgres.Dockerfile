FROM postgres
WORKDIR /docker-entrypoint-initdb.d
ADD ./sql/currency.sql /docker-entrypoint-initdb.d
EXPOSE 5432