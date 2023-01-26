FactoryBot.define do
    factory :rate do
        association :from_currency, factory: :currency
        association :to_currency, factory: :currency
        date { Time.now }
        rate { Faker::Number.decimal(l_digits: 4) }
        source { Faker::Internet.url }
    end
end
