FROM php:7.2.2-fpm
RUN apt-get update -y && apt-get install -y libmcrypt-dev openssl
RUN docker-php-ext-install pdo mcrypt mbstring
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN docker-php-ext-install pdo mcrypt mbstring
WORKDIR /app
COPY ./php-laravel /app
RUN composer install
CMD php artisan serve --host=0.0.0.0 --port=3001
EXPOSE 3001