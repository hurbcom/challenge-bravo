module Converter
  module UseCases
    class CurrencyConverter

      def self.build
        conversion_api = Converter::Services::CryptocompareApi.build
        currency_repository = Converter::Repositories::AllCurrencies.build
        new(conversion_api:  conversion_api, currency_repository: currency_repository)
      end

      def initialize(conversion_api:, currency_repository:)
        @conversion_api = conversion_api
        @currency_repository = currency_repository
      end

      def execute(from:, to:, amount:)
        from_currency = @currency_repository.find_by_code(from)
        to_currency =  @currency_repository.find_by_code(to)
        ballast_currency = @currency_repository.find_ballast
        quotation = @conversion_api.get_exchange_rate(from: from_currency.code, to: to_currency.code, ballast: ballast_currency.code)
        quotation.calculate(amount: amount)
      end

    end
  end
end