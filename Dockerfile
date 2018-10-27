FROM node
 
RUN useradd --user-group --create-home --shell /bin/false hu && \ 
apt-get clean

ENV HOME=/home/hu

COPY package.json $HOME/app/
COPY .env $HOME/app/
COPY src/ $HOME/app/src

WORKDIR $HOME/app
RUN npm i --silent --progress=false --production

RUN chown -R hu:hu $HOME/app
USER hu

EXPOSE 6660

CMD ["npm", "start"]