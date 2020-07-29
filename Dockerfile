FROM zooxsmart/php:7.4

MAINTAINER Mario Costa <mariojr.rcosta@gmail.com>

EXPOSE 8080

COPY . /app

COPY .env.dist /app/.env

ENV PATH /root/.local/bin:$PATH

WORKDIR /app

# Run this for production environment
#RUN composer install --prefer-dist --no-dev -o
RUN composer install --prefer-dist

CMD ["/app/deploy/entrypoint.sh"]

