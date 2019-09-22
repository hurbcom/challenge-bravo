require 'rails_helper'

describe CurrencyConversorService do
  before do
    create(:currency_ballast)
    allow_any_instance_of(EuCentralBank).to receive(:update_rates)
  end

  subject { instance.execute }

  describe 'when not permited conversion' do
    context 'with from value' do
      let(:instance) { described_class.new(from: 'wrong_code', to: 'usd', amount: 1) }

      it do
        expect { subject }.to raise_error CurrencyConversorService::CurrencyFromNotAllowed
      end
    end

    context 'with from value' do
      let(:instance) { described_class.new(from: 'usd', to: 'wrong_code', amount: 1) }

      it do
        expect { subject }.to raise_error CurrencyConversorService::CurrencyToNotAllowed
      end
    end
  end

  describe 'when convert from money to money' do
    let(:instance) { described_class.new(from: 'usd', to: 'brl', amount: 1) }

    before do
      create(:currency, code: 'BRL', name: 'Real', country: 'Brazil')
      allow_any_instance_of(EuCentralBank).to receive(:exchange).and_return ('1.5')
      expect_any_instance_of(EuCentralBank).to receive(:exchange).with(100, 'USD', 'BRL')
    end

    it do
      result = subject
      expect(result[:amount]).to eq 1.5
      expect(result[:record].code).to eq 'BRL'
    end
  end

  describe 'when convert from crypto_coin to money' do
    let(:instance) { described_class.new(from: 'btc', to: 'brl', amount: 2) }

    before do
      create(:currency_crypto_coin)
      create(:currency, code: 'BRL', name: 'Real', country: 'Brazil')
      allow(Cryptocompare::Price).to receive(:find).and_return(
        {
          BTC: {
            USD: 1.5
          }
        }.with_indifferent_access
      )
      allow_any_instance_of(EuCentralBank).to receive(:exchange).and_return('3.5')

      expect(Cryptocompare::Price).to receive(:find).with('BTC', 'USD')
      expect_any_instance_of(EuCentralBank).to receive(:exchange).with(300, 'USD', 'BRL')
    end

    it do
      result = subject
      expect(result[:amount]).to eq 3.5
      expect(result[:record].code).to eq 'BRL'
    end
  end


  describe 'when convert from money to crypto_coin' do
    let(:instance) { described_class.new(from: 'brl', to: 'btc', amount: 2) }

    before do
      create(:currency_crypto_coin)
      create(:currency, code: 'BRL', name: 'Real', country: 'Brazil')
      allow(Cryptocompare::Price).to receive(:find).and_return(
        {
          USD: {
            BTC: 12
          }
        }.with_indifferent_access
      )
      allow_any_instance_of(EuCentralBank).to receive(:exchange).and_return('4')

      expect_any_instance_of(EuCentralBank).to receive(:exchange).with(200, 'BRL', 'USD')
      expect(Cryptocompare::Price).to receive(:find).with('USD', 'BTC')
    end

    it do
      result = subject
      expect(result[:amount]).to eq 48
      expect(result[:record].code).to eq 'BTC'
    end
  end
end
