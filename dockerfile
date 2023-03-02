FROM node:18.12-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN apk add --no-cache make
RUN apk add pkgconfig
RUN apk add build-base

RUN npm ci

COPY --chown=node:node . .

USER node

FROM node:18.12-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN apk add --update --no-cache openssl1.1-compat

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

FROM node:18.12-alpine As production

RUN apk add --update --no-cache openssl1.1-compat


COPY --chown=node:node --from=build /usr/src/app/package*.json ./
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "npm", "run", "start" ]