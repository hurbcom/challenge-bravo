FROM php:7.2.10-fpm

RUN apt-get update && apt-get install -y --allow-unauthenticated \
    gnupg \
    libcurl4-openssl-dev \
    zlib1g-dev \
    git \
    && docker-php-ext-install curl \
    && docker-php-ext-install zip;

RUN cd ~ \
    && curl -sS https://getcomposer.org/installer -o composer-setup.php \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer;
