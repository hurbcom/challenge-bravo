FROM vnascimento01/node_impacta_img
WORKDIR /app
COPY ./app ./

#https://docs.docker.com/compose/compose-file/compose-file-v2/
#dockerfile: .Dockerfile-alternate

RUN npm install
RUN npm install && npm install -g pm2 nodemon

RUN apt-get update && apt-get -y upgrade

RUN sed -i 's/DEFAULT\@SECLEVEL\=2/DEFAULT\@SECLEVEL\=1/' /etc/ssl/openssl.cnf

CMD ["node", "server"]
# CMD ["pm2-docker", "ecosystem.config.js"]