FROM node:16-alpine AS build
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile && \ 
    yarn build

FROM node:16-alpine AS runner
EXPOSE 8080
WORKDIR /app
COPY --from=build /app ./
CMD ["yarn", "start"]