require 'sequel/core'

DB = Sequel.connect(ENV['DATABASE_URL'])