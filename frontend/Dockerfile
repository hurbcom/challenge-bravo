FROM node:alpine AS frontend_base
WORKDIR /app
COPY ./package.json .

FROM frontend_base AS frontend_dependencies
RUN yarn --no-progress

FROM frontend_dependencies AS frontend_development
COPY --from=frontend_dependencies /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD [ -d "node_modules" ] && yarn dev

FROM frontend_dependencies AS frontend_production
COPY --from=frontend_dependencies /app/node_modules ./node_modules
COPY . .
RUN yarn build
EXPOSE 3000
CMD yarn start
