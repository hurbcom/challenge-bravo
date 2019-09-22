class ApplicationController < ActionController::Base
  skip_before_action :verify_authenticity_token, if: Proc.new { |c| c.request.format == 'application/json' }
end
