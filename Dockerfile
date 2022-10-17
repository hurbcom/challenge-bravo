FROM node:16-slim AS build
WORKDIR /app
COPY . .
RUN apt-get update
RUN apt-get install -y openssl
RUN yarn install --frozen-lockfile && \ 
    yarn build && \
    yarn prisma:generate

FROM node:16-slim AS runner
RUN apt-get update
RUN apt-get install -y openssl
EXPOSE 8080
WORKDIR /app
COPY --from=build /app ./
CMD ["yarn", "start"]