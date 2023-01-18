# Alpine for lighter image
FROM ruby:3.0.0-alpine AS base

# RUN apk add --no-cache build-base postgresql-dev postgresql-client tzdata openssl-dev libressl-dev git

RUN apk add  --no-cache  build-base libressl-dev tzdata openssl-dev git

ENV APP_HOME /app
ENV APP_NAME="exchange-rate-service"
ENV PORT 3000

EXPOSE $PORT

WORKDIR $APP_HOME
COPY Gemfile $APP_HOME/Gemfile
COPY Gemfile.lock $APP_HOME/Gemfile.lock

RUN gem install bundler && \
    bundle install --jobs=4 --retry=5 && \
    rm -rf $GEM_HOME/cache/*.gem && \
    find $GEM_HOME/gems/ -name "*.c" -delete && \
    find $GEM_HOME/gems/ -name "*.o" -delete

COPY . $APP_HOME

CMD rails server -b 0.0.0.0

# deploy image
FROM base AS deploy

# Dont run as root
ENV RUN_USER user
RUN addgroup -S $RUN_USER && \
    adduser -h $APP_HOME -S -s /bin/false $RUN_USER -G $RUN_USER && \
    chown -R $RUN_USER:$RUN_USER $APP_HOME
USER $RUN_USER

# ENTRYPOINT ["/app/entrypoint.sh"]

# This would usually be done through an entrypoint in production
# i.e to fetch envs before starting the server.
CMD rails server -b 0.0.0.0
