class ApplicationController < ActionController::Base
  skip_before_action :verify_authenticity_token, if: Proc.new { |c| c.request.format == 'application/json' }

  def render_json_error(status:, message:)
    render json: { error: message }, status: status
  end
end
