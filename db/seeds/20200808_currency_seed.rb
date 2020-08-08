require_relative "../../api/v1/models/currency"

Sequel.seed do
  def run
    currencies = [
      { name: "US Dollar", code: "USD", type: "fiat money", ballast: true},
      { name: "Brazilian Real", code: "BRL", type: "fiat money", ballast: false},
      { name: "Euro", code: "EUR", type: "fiat money", ballast: false},
      { name: "Bitcoin", code: "BTC", type: "cryptocurrency", ballast: false},
      { name: "Ethereum", code: "ETH", type: "cryptocurrency", ballast: false}
    ]
    currencies.each do |currency|
      Currency.create(name: currency[:name], code: currency[:code], type: currency[:type], ballast: currency[:ballast])
    end
  end
end
