module Converter
  module Exceptions
    class UniqueConstraintViolation < RuntimeError

      attr_reader :code

      def initialize(message)
        super(message)
        @code = 400
      end

    end
  end
end
