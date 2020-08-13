module Converter
  module Exceptions
    class CryptocompareApiNotFoundException < RuntimeError

      attr_reader :code

      def initialize
        super('Cryptocompare could not find this resource')
        @code = 404
      end

    end
  end
end