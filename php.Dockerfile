FROM php:fpm
RUN apt-get update -y && apt-get install -y libmcrypt-dev openssl
RUN pecl install mongodb && docker-php-ext-enable mongodb
RUN docker-php-ext-install pdo mbstring
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
WORKDIR /app
COPY ./php-laravel /app
RUN useradd -rm -d /home/deploy -s /bin/bash -g root -G sudo -u 1001 deploy
USER deploy
RUN composer update
CMD php artisan serve --host=0.0.0.0 --port=3001
EXPOSE 3001