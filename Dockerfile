FROM ruby:2.6.6
RUN mkdir /app
WORKDIR /app
COPY Gemfile /app/Gemfile
COPY Gemfile.lock /app/Gemfile.lock
ENV BUNDLER_VERSION 2.1.4
RUN gem install bundler && bundle install
COPY . /app
EXPOSE 3000
CMD ["rackup"]