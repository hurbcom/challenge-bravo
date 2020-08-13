module Converter
  module Exceptions
    class CryptocompareApiTimeOutException < RuntimeError

      attr_reader :code

      def initialize
        super('Cryptocompare API has timed out')
        @code = 408
      end

    end
  end
end
