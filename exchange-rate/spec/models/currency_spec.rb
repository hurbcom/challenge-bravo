require 'rails_helper'

RSpec.describe Currency, type: :model do

    describe 'validations' do

        subject { FactoryBot.build(:currency) }

        it { should validate_presence_of(:name) }
        it { should validate_presence_of(:code) }
        it { should validate_uniqueness_of(:name) }
        it { should validate_uniqueness_of(:code) }
        it { should validate_length_of(:code).is_at_least(3).is_at_most(5) }
    end

    describe 'associations' do
        it { should have_many(:rates) }
        it { should have_many(:inverse_rates) }
    end

    describe 'before_save' do
        it 'should save code uppercase' do
            currency = Currency.create(name: 'Euro', code: 'eur')
            expect(currency.code).to eq('EUR')
        end
    end

    describe 'create_rate' do
        it 'should create a rate and inverse rate' do
            currency = Currency.create(name: 'Euro', code: 'eur')
            currency2 = Currency.create(name: 'Dollar', code: 'usd')
            currency.create_rate(to_id: currency2.id, rate: 1.2, source: 'https://www.google.com')
            expect(currency.rates.count).to eq(1)
            expect(currency.inverse_rates.count).to eq(1)
        end
    end
end
