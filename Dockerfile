FROM php:7.3-cli as build

RUN apt-get update \
     && apt-get upgrade -y \
     && apt-get install -y git unzip libzip-dev

RUN docker-php-ext-configure zip --with-libzip \
    && docker-php-ext-install zip

COPY . /var/www/html/challenge-bravo
COPY --from=composer /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html/challenge-bravo/

RUN composer install

FROM php:7.3-apache

COPY --from=build /var/www/html/challenge-bravo/ /var/www/html/challenge-bravo/

WORKDIR /var/www/html/challenge-bravo/

RUN sed -i 's!/var/www/html!/var/www/html/challenge-bravo/public!g' /etc/apache2/apache2.conf \
      /etc/apache2/sites-available/000-default.conf \
      && a2enmod rewrite

EXPOSE 80 443
