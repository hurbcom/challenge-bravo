# Builder
FROM node:16-alpine as Builder

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Runner

FROM node:16-alpine as Runner

WORKDIR /app

RUN adduser -D app && chown -R app:app /app

USER app

COPY package.json yarn.lock /app/

RUN yarn install --frozen-lockfile --production

COPY --from=Builder /app/dist /app/

EXPOSE 8080

ENTRYPOINT [ "node", "main.js" ]
