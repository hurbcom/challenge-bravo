FROM node:10.16

# Deve ser o UID da máquina do desenvolvedor
ARG USER_ID=1000
ARG ENV=production

ENV ENV=$ENV

# Substitui usuário node que já vem por padrão pelo usuário "hurb"
# que utiliza o USER_ID da máquina host do desenvolvedor para que não
# haja problemas de permissão durante o desenvolvimento
RUN deluser --remove-home node; \
    useradd -u ${USER_ID} -g www-data --shell /bin/bash --create-home hurb

# Configuração necessária para evitar problemas de permissionamento
# ao executar pacotes globais pelo NPM com um usuário sem privilégios
RUN mkdir /home/hurb/.npm-global ; \
    chown -R hurb /home/hurb/.npm-global
ENV PATH=/home/hurb/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/hurb/.npm-global

# Instalação do gerencidor de processo do node
RUN npm install -g pm2

# Cria diretório onde ficará a aplicação e aplica as permissões necessárias
RUN mkdir -p /var/www/hurb
WORKDIR /var/www/hurb
COPY . .
RUN chown -R hurb:www-data /var/www

# Copiando scripts utilizados na image/container e dando as devidas permissões
COPY scripts/docker-*.sh /scripts/
RUN chmod +x /scripts/docker-*.sh
RUN chown hurb:www-data /scripts/docker-*.sh

# Os comandos a partir daqui, como também os que forem executados dentro do
# container irão utilizar este usuário
USER hurb

# Irá rodar o npm install, mas apenas se for o ambiente de produção
# como em desenvolvimento há mapeamento de volume não faz sentido
# rodar o npm install durante o build da imagem
RUN /scripts/docker-install.sh

VOLUME /var/www/hurb
EXPOSE 3000

ENTRYPOINT ["/scripts/docker-entrypoint.sh"]
