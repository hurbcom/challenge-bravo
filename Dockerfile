FROM node

RUN useradd --user-group --create-home --shell /bin/false hu-top && \
  apt-get clean

ENV HOME=/home/hu-top

COPY package.json $HOME/app/
COPY src/ $HOME/app/src

WORKDIR $HOME/app
RUN npm install --silent --progress=false --production

RUN chown -R hu-top:hu-top $HOME/app
USER hu-top

EXPOSE 3000

CMD ["npm", "start"]
