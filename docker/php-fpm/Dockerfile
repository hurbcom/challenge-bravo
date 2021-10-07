FROM php:8-fpm

# Install modules
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug \
    && pecl install apcu \
    && docker-php-ext-enable apcu

CMD ["php-fpm"]
