FROM node:16-alpine AS installer
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile

FROM installer as build
WORKDIR /app
RUN yarn build && \
    rm -rf node_modules

FROM node:16-alpine AS deps
WORKDIR /app
COPY yarn.lock package.json ./
RUN yarn cache clean
RUN yarn install --production --frozen-lockfile

FROM node:16-alpine AS runner
ENV NODE_ENV production
EXPOSE 3000
WORKDIR /app
COPY --from=build /app ./
COPY --from=deps /app/node_modules ./node_modules
CMD ["yarn", "start:prod"]
