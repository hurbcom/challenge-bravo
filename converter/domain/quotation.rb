require 'money'

module Converter
  module Domain
    class Quotation

      MULTIPLIER = 100.freeze

      def initialize(to:, from:, ballast:, response:)
        @to = to
        @from = from
        @ballast = ballast
        @response = response
      end

      def calculate(amount:)
        standard_amount = (amount * MULTIPLIER).to_i
        Money.add_rate(@from, @to, @response[@to])
        Money.add_rate(@from, @ballast, @response[@ballast])
        quotation =  Money.new(standard_amount, @from).exchange_to(@to).format
        ballast_quotation =  Money.new(standard_amount, @from).exchange_to(@ballast).format
        {
          from: @from,
          to: @to,
          amount: amount,
          quotation: quotation,
          ballast: @ballast,
          ballast_quotation: ballast_quotation
        }
      end

    end
  end
end