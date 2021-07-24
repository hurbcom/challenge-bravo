FROM node:14-slim AS backend_base
WORKDIR /app
COPY ./package.json .

FROM backend_base AS puppeteer_config
RUN  apt-get update \
     && apt-get install -y wget gnupg ca-certificates \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     # We install Chrome to get all the OS level dependencies, but Chrome itself
     # is not actually used as it's packaged in the node puppeteer library.
     # Alternatively, we could could include the entire dep list ourselves
     # (https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix)
     # but that seems too easy to get out of date.
     && apt-get install -y google-chrome-stable \
     && rm -rf /var/lib/apt/lists/* \
     && wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh \
     && chmod +x /usr/sbin/wait-for-it.sh

FROM puppeteer_config AS backend_dependencies
RUN yarn --no-progress

FROM backend_dependencies AS backend_development
COPY --from=backend_dependencies /app/node_modules ./node_modules
COPY . .
EXPOSE 3333
CMD [ -d "node_modules" ] && yarn dev

FROM backend_dependencies AS backend_production
COPY --from=backend_dependencies /app/node_modules ./node_modules
COPY . .
RUN yarn build
EXPOSE 3333
CMD yarn start
