require 'roda'
require 'sequel'
require 'require_all'
require_all 'converter'
require_all 'api'
require_all 'db/db.rb'
require_all 'models'
require_all 'money_configuration'

class ChallengeBravo < Roda
  route do |r|
    r.run API::V1::Base
  end
end