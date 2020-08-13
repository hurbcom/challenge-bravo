Sequel.seed do
  def run
    currencies = [
      { name: "US Dollar", code: "USD", type: "fiat_money"},
      { name: "Brazilian Real", code: "BRL", type: "fiat_money"},
      { name: "Euro", code: "EUR", type: "fiat_money"},
      { name: "Bitcoin", code: "BTC", type: "cryptocurrency"},
      { name: "Ethereum", code: "ETH", type: "cryptocurrency"}
    ]
    currencies.each do |currency|
      Currency.create(name: currency[:name], code: currency[:code], type: currency[:type])
    end
    currency_id = Currency.where(code: 'USD').first.id
    Ballast.create(currency_id: currency_id)
  end
end
