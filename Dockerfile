FROM php:7.4-fpm-alpine

WORKDIR /var/www/html/

RUN php -r "readfile('http://getcomposer.org/installer');" | php -- --install-dir=/usr/bin/ --filename=composer

COPY . .

RUN composer install \
    && chmod +x entrypoint.sh

ENTRYPOINT ["sh", "entrypoint.sh"]
