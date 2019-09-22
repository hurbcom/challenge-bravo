class CurrencyConversorService

  NORMAL_CURRENCY_MULTIPLIER = 100.freeze

  def initialize(from:, to:, amount:)
    @from = from.upcase
    @to = to.upcase
    @amount = amount * NORMAL_CURRENCY_MULTIPLIER
    @eu_bank = EuCentralBank.new
    @eu_bank.update_rates
  end

  def execute
    validate_permited_currencies
    its_crypto_coin_conversion? ? convert_from_crypto_coin : convert_normal_currency
    build_currency_result
  end

  private

  def validate_permited_currencies
    @currency_from = Currency.find_by(code: @from)
    raise CurrencyFromNotAllowed unless @currency_from.present?

    @currency_to = Currency.find_by(code: @to)
    raise CurrencyToNotAllowed unless @currency_to.present?
  end

  def its_crypto_coin_conversion?
    @currency_from.crypto_coin? or @currency_to.crypto_coin?
  end

  def convert_from_crypto_coin
    code_ballast = Currency.ballast.first.code
    @converted_value =
      if @currency_from.crypto_coin? and @currency_to.crypto_coin?
        Cryptocompare::Price.find(@from, @to)[@from][@to]

      elsif @currency_from.crypto_coin?
        coin_value = Cryptocompare::Price.find(@from, code_ballast)[@from][code_ballast]
        ballast_value = coin_value * @amount
        @eu_bank.exchange(ballast_value, code_ballast, @to).to_f

      else
        currency_value = @eu_bank.exchange(@amount, @from, code_ballast).to_f
        dollar_value = Cryptocompare::Price.find(code_ballast, @to)[code_ballast][@to]
        dollar_value * currency_value
      end
  end

  def convert_normal_currency
    @converted_value = @eu_bank.exchange(@amount, @from, @to).to_f
  end

  def build_currency_result
    {
      record: @currency_to,
      amount: @converted_value
    }
  end

  protected

  class CurrencyFromNotAllowed < StandardError ; end
  class CurrencyToNotAllowed < StandardError ; end
end
