FROM node:14.15

WORKDIR /usr/src/app

COPY package.json .
COPY ./src .

COPY ./docker/docker-entrypoint.sh /docker/docker-entrypoint.sh
RUN chmod +x /docker/docker-entrypoint.sh

COPY ./docker/wait-for-it.sh /docker/wait-for-it.sh
RUN chmod +x /docker/wait-for-it.sh

EXPOSE 3000

ENTRYPOINT ["/docker/docker-entrypoint.sh"]