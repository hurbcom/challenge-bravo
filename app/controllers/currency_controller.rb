class CurrencyController < ApplicationController

  def create
    @currency = Currency.create!(create_params)
    render template: "currency/show"
  rescue ActiveRecord::RecordInvalid => error
    render json: { error: error.message }, status: :bad_request
  rescue Currency::CreateTestIntegrityError
    render json: { error: 'You\'re trying to create a currency not supported by conversor service or can be a temporary error.' }, status: :bad_request
  end

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

  def create_params
    params.require(:currency).permit(:code, :symbol, :name, :country, :default)
  end

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
