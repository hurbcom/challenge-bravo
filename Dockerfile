FROM ruby:2.5.0
RUN apt-get update -qq && apt-get install -y libpq-dev default-libmysqlclient-dev
RUN mkdir /currency
WORKDIR /currency
COPY Gemfile /currency/Gemfile
COPY Gemfile.lock /currency/Gemfile.lock
ENV BUNDLER_VERSION 2.0.2
RUN gem install bundler && bundle install --jobs 20 --retry 5
COPY . /currency

# Add a script to be executed every time the container starts.
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

# Start the main process.
CMD ["rails", "server", "-b", "0.0.0.0"]