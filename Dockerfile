FROM node:14.15.3

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

ARG NODE_VERSION=14.15.1
ARG SERICE=ms-converter
ARG NVM_DIR=/usr/local/.nvm

RUN apt-get -y update --fix-missing
RUN apt-get -y install curl
RUN apt-get install -y build-essential libssl-dev

# Install nvm with node and npm
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.30.1/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

RUN ["chmod", "+x", "usr/local/.nvm/nvm.sh"]

COPY . /usr/$SERVICE
WORKDIR /usr/$SERVICE

RUN npm update \
    && npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]