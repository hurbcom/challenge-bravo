FactoryBot.define do
  factory :currency, class: Currency do
    code { 'USD' }
    symbol { '$' }
    name { 'Dollar' }
    country { 'United States' }

    factory :currency_ballast do
      default { true }
    end

    factory :currency_crypto_coin do
      code { 'BTC' }
      symbol { 'bitcoin' }
      name { 'Bitcoin' }
      country { 'N/D' }
      definition { 'crypto_coin' }
    end
  end
end