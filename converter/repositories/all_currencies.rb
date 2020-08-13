module Converter
  module Repositories
    class AllCurrencies

      def self.build
        currency_repository = Currency
        ballast_repository = Ballast
        new(currency_repository: currency_repository, ballast_repository: ballast_repository)
      end

      def initialize(currency_repository:, ballast_repository:)
        @currency_repository = currency_repository
        @ballast_repository = ballast_repository
      end

      def create(currency_params)
        @currency_repository.create(currency_params)
      end

      def find_by_code(code)
        model_object = @currency_repository.find(code: code)
        raise Converter::Exceptions::CurrencyNotFoundException.new if model_object.nil?
        Converter::Domain::Currency.build_from_model(model_object)
      end

      def find_ballast
        model_object = @ballast_repository.first.currency
        Converter::Domain::Currency.build_from_model(model_object)
      end

    end
  end
end