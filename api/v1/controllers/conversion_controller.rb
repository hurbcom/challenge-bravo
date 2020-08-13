class ConversionController

  def show(from:, to:, amount:)
    use_case = Converter::UseCases::CurrencyConverter.build
    use_case.execute(from: from, to: to, amount: amount)
  end

end