require 'roda'
require_relative './api/v1/currency'
class ChallengeBravo < Roda
  route do |r|
    r.run API::Currency
  end
end