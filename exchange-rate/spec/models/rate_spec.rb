require 'rails_helper'

RSpec.describe Rate, type: :model do

    describe 'validations' do
        subject { FactoryBot.build(:rate) }

        it { should validate_presence_of(:date) }
        it { should validate_presence_of(:rate) }
        it { should validate_numericality_of(:rate).is_greater_than(0) }
        it { should validate_uniqueness_of(:date).scoped_to(:from_currency_id) }
        it { should allow_value('https://www.google.com').for(:source) }
        it { should_not allow_value('google.com').for(:source) }
    end

    describe 'associations' do
        it { should belong_to(:from_currency) }
        it { should belong_to(:to_currency) }
    end

    describe 'before_save' do
        it 'should save rate with precision 10 scale 6' do
            rate = Rate.create(from_currency_id: 1, to_currency_id: 2, date: Date.today, rate: 1.123456, source: 'https://www.google.com')
            expect(rate.rate).to eq(0.1123456e1)
        end
    end
end
