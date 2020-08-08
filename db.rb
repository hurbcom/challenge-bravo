begin
  require_relative '.env.rb'
rescue LoadError
end

require 'sequel/core'

DB = Sequel.connect(ENV.delete('APP_DATABASE_URL') || ENV.delete('DATABASE_URL'))