require 'roda'
require 'sequel'
require_relative 'models'
require_relative 'api/v1/base'
class ChallengeBravo < Roda
  route do |r|
    r.run API::V1::Base
  end
end