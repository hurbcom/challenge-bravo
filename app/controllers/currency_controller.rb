class CurrencyController < ApplicationController

  def create
    @currency = Currency.create!(create_params)
    render template: "currency/show"
  rescue ActiveRecord::RecordInvalid => error
    render_json_error(status: :bad_request, message: error.message)
  rescue Currency::CreateTestIntegrityError
    render_json_error(
      status: :bad_request,
      message: 'You\'re trying to create a currency not supported by conversor service ' \
        'or can be a temporary error.'
    )
  end

  def convert
    conversor_service_execute
  rescue CurrencyConversorService::CurrencyFromNotAllowed
    render_json_error(status: :bad_request, message: 'it\'s not permited this from currency')
  rescue CurrencyConversorService::CurrencyToNotAllowed
    render_json_error(status: :bad_request, message: 'it\'s not permited this to currency')
  rescue => error
    Rails.logger.error(error)
    render_json_error(
      status: :internal_server_error,
      message: 'Something wrong happend, try again late...'
    )
  end

  private

  def create_params
    params.require(:currency).permit(:code, :symbol, :name, :country, :default, :definition)
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
