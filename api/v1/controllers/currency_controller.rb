class CurrencyController

  def index
    @currency = Currency.all
  end

  def create(params)
    begin
      currency = Currency.create(params)
      currency.to_hash
    rescue Sequel::ValidationFailed => e
      raise Converter::Exceptions::ValidationFailed.new(e.message)
    rescue Sequel::UniqueConstraintViolation => e
      raise Converter::Exceptions::UniqueConstraintViolation.new(e.message)
    rescue Exception => e
      raise Converter::Exceptions::GeneralException.new(e.message)
    end
  end

end