FactoryBot.define do
  factory :currency do
    name { Faker::Currency.name }
    code { Faker::Currency.code }
end
end
