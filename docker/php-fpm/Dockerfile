FROM php:7.2.10-fpm

RUN apt-get update && apt-get install -y --allow-unauthenticated \
    gnupg \
    libcurl4-openssl-dev \
    zlib1g-dev \
    git \
    sendmail \
    && pecl install mcrypt-1.0.1 \
    && docker-php-ext-enable xdebug mcrypt \
    && docker-php-ext-install pdo pdo_mysql \
    && docker-php-ext-install tokenizer \
    && docker-php-ext-install curl \
    && docker-php-ext-install zip;

RUN cd ~ \
    && curl -sS https://getcomposer.org/installer -o composer-setup.php \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer;
