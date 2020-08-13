require 'roda'
require 'sequel'
require_relative '../money_configuration/money_configuration.rb'

APPLICATION_PATH = File.dirname(__FILE__) + '/../'

DB ||= Sequel.connect('mock://postgres')

Dir.glob("#{APPLICATION_PATH}converter/use_cases/*.rb", &method(:require) )
Dir.glob("#{APPLICATION_PATH}converter/services/*.rb", &method(:require) )
Dir.glob("#{APPLICATION_PATH}converter/domain/*.rb", &method(:require) )
Dir["#{APPLICATION_PATH}converter/exceptions/*.rb"].sort.each { |f| require f }

RSpec.configure do |config|
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end
  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end
  config.shared_context_metadata_behavior = :apply_to_host_groups
end
