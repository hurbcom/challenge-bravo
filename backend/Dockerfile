FROM node:14-slim AS backend_base
WORKDIR /app
COPY ./backend/package.json .

FROM backend_base AS backend_dependencies
RUN yarn --no-progress

FROM backend_dependencies AS backend_development
COPY --from=backend_dependencies /app/node_modules ./node_modules
COPY ./backend .
EXPOSE 3333
CMD [ -d "node_modules" ] && yarn dev

FROM backend_dependencies AS backend_production
COPY --from=backend_dependencies /app/node_modules ./node_modules
COPY ./backend .
RUN yarn build
EXPOSE 3333
CMD yarn start
