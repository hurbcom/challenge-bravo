FROM postgres
WORKDIR /docker-entrypoint-initdb.d
ADD ./sql/database.sql /docker-entrypoint-initdb.d
EXPOSE 5432