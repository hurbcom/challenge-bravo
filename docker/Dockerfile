FROM node:14.15

WORKDIR /usr/src/app

COPY ./src .

COPY ./docker/docker-entrypoint.sh /docker/docker-entrypoint.sh
RUN chmod +x /docker/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/docker/docker-entrypoint.sh"]