module Converter
  module Exceptions
    class CryptocompareApiUnauthorizedException < RuntimeError

      attr_reader :code

      def initialize
        super('Cryptocompare has not allowed access to this resource')
        @code = 401
      end

    end
  end
end
