require 'pry-byebug'
module API
  module V1
    class Base < Roda

      EXCEPTIONS = [
        Converter::Exceptions::CurrencyNotFoundException,
        Converter::Exceptions::CryptocompareApiUnauthorizedException,
        Converter::Exceptions::CryptocompareApiTimeOutException,
        Converter::Exceptions::CryptocompareApiNotFoundException,
        Converter::Exceptions::UniqueConstraintViolation,
        Converter::Exceptions::ValidationFailed,
        RuntimeError
      ]

      plugin :json
      plugin :json_parser
      plugin :all_verbs
      plugin :error_handler, classes: EXCEPTIONS

      error do |e|
        { error: e.message, status: response.status = e.code }
      end

      route do |r|
        r.on "api" do
          r.on "v1" do
            r.get 'currencies' do
              currency.index
            end

            r.on 'convert' do
              params = r.params
              conversion.show(from: params["from"].upcase, to: params["to"].upcase, amount: params["amount"].to_f)
            end

            r.post 'currency' do
              params = r.params
              currency.create(params)
            end
          end
        end
      end

      private

      def currency
        CurrencyController.new
      end

      def conversion
        ConversionController.new
      end

    end
  end
end