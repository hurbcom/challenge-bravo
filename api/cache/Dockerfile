FROM rastasheep/alpine-node-chromium:14-alpine


ENV HOME=/usr/src/challenge-bravo-job

RUN mkdir -p $HOME/

WORKDIR $HOME

COPY . $HOME/

RUN npm i

# Executar job para atualizar cache

CMD [ "node", "index.js" ]

EXPOSE 3000
