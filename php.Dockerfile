ARG PHP_VERSION=7.4
ARG COMPOSER_VERSION=2.0

FROM composer:${COMPOSER_VERSION}
FROM php:${PHP_VERSION}-cli

RUN apt-get update && \
    apt-get install -y autoconf pkg-config libssl-dev git libzip-dev zlib1g-dev && \
    pecl install mongodb && docker-php-ext-enable mongodb && \
    pecl install xdebug && docker-php-ext-enable xdebug && \
    pecl install redis && docker-php-ext-enable redis && \
    docker-php-ext-install -j$(nproc) pdo_mysql zip

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /app

COPY ./php-laravel /app

COPY ./php-laravel/.env.example /app
RUN mv /app/.env.example /app/.env

RUN composer install

CMD php artisan serve --host=0.0.0.0 --port=3001
EXPOSE 3001
