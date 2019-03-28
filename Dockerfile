FROM php:7.3-apache

RUN apt-get update \
     && apt-get upgrade -y \
     && apt-get install -y git unzip libzip-dev

RUN docker-php-ext-configure zip --with-libzip \
    && docker-php-ext-install zip

COPY . /var/www/html/challenge-bravo
COPY --from=composer /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html/challenge-bravo/

RUN composer install

RUN sed -i 's!/var/www/html!/var/www/html/challenge-bravo/public!g' /etc/apache2/apache2.conf \
      /etc/apache2/sites-available/000-default.conf \
      && a2enmod rewrite

RUN chown -R www-data:www-data /var/www/html/

EXPOSE 80 443