module Converter
  module Exceptions
    class CurrencyNotFoundException < RuntimeError

      attr_reader :code

      def initialize
        super("Currency code not found")
        @code = 400
      end

    end
  end
end
