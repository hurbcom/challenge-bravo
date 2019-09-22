require 'database_cleaner'

RSpec.configure do |config|
  config.before(:suite) do
    DatabaseCleaner[:active_record, connection: :test].clean_with :truncation
  end

  config.before(:each) do
    DatabaseCleaner[:active_record, connection: :test].strategy = :truncation
  end

  config.before(:each) do
    DatabaseCleaner.start
    DatabaseCleaner.clean
  end
end
