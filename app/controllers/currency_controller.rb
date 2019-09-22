class CurrencyController < ApplicationController

  def convert
    conversor_service_execute
  rescue CurrencyConversorService::CurrencyFromNotAllowed
    render json: { error: 'it\'s not permited this from currency' }, status: :bad_request
  rescue CurrencyConversorService::CurrencyToNotAllowed
    render json: { error: 'it\'s not permited this to currency' }, status: :bad_request
  rescue => error
    Rails.logger.error(error)
    render json: { error: 'Something wrong happend, try again late...' }, status: :internal_server_error
  end


  private

  def convert_params
    params.permit(:amount, :from, :to)
  end

  def conversor_service_execute
    service = CurrencyConversorService.new(
      from: convert_params[:from],
      to: convert_params[:to],
      amount: convert_params[:amount].to_i
    )
    @converted_result = service.execute
  end
end
