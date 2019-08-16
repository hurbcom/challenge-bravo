FROM php:7.1-fpm

# Instalação de pacotes necessários
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  curl \
  libmemcached-dev \
  libz-dev \
  libpq-dev \
  libssl-dev \
  libmcrypt-dev \
  zlib1g-dev \
  gettext-base \
  && rm -rf /var/lib/apt/lists/*

# Habilitando módulos do PHP
RUN docker-php-ext-install mcrypt \
  && docker-php-ext-install mbstring \
  && docker-php-ext-install zip \
  && docker-php-ext-install pdo_mysql \
  && docker-php-ext-install pdo_pgsql

# Script de inicialização do container
COPY ./docker/app/docker-entrypoint.sh /docker/docker-entrypoint.sh
RUN chmod +x /docker/docker-entrypoint.sh

# Baixando o composer e disponibilizando-o globalmente
RUN cd /usr/local/bin && curl -s https://getcomposer.org/installer | php
RUN mv /usr/local/bin/composer.phar /usr/local/bin/composer

# Adição de usuário default
RUN useradd -u 1000 -g www-data --shell /bin/bash --create-home davicervo

# Copiando projeto para dentro da imagem e aplicando permissões necessárias para sua execução
COPY ./src .
RUN chmod -R 775 /var/www
RUN chown -R davicervo:www-data /var/www
WORKDIR /var/www/html

USER davicervo

# Instalação de pacotes necessários do laravel
RUN composer install

VOLUME /var/www/html
EXPOSE 9000

ENTRYPOINT ["/docker/docker-entrypoint.sh"]