FactoryBot.define do
  factory :currency, class: Currency do
    code { 'USD' }
    symbol { '$' }
    name { 'Dollar' }
    country { 'United States' }

    factory :currency_ballast do
      default { true }
    end
  end
end