FROM node:14.15.4-slim

ENV HOME=/usr/src/challenge-bravo

RUN mkdir -p $HOME/

WORKDIR $HOME

COPY . $HOME/

RUN npm i

CMD [ "node", "index.js" ]

EXPOSE 3000
