# frozen_string_literal: true

source "https://rubygems.org"

git_source(:github) {|repo_name| "https://github.com/#{repo_name}" }

ruby '2.6.6'

gem 'roda', '>= 3.19'
gem 'sequel', '>= 5'
gem 'sequel_pg', '>= 1.8'
gem 'rack-unreloader'
gem 'rest-client'
gem 'rake'
gem 'sequel-seed'

group :development do
  gem 'pry-byebug'
end

group :test do
  gem 'rspec'
end
