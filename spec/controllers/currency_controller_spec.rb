require 'rails_helper'

describe CurrencyController, type: :controller do
  render_views

  before do
    allow_any_instance_of(Currency).to receive(:test_integrity_with_conversor_service)
    create(:currency_ballast)
    create(:currency_crypto_coin)
    allow_any_instance_of(EuCentralBank).to receive(:update_rates)
  end

  describe 'When success converted' do
    let(:mock_result) do
      {
        record: Currency.first,
        amount: 10.50
      }
    end

    before do
      allow_any_instance_of(CurrencyConversorService).to receive(:execute).and_return(mock_result)
      get :convert, format: :json, params: { from: 'USD', to: 'BTC', amount: 1 }
    end

    let(:body_expectation) do
      {
        code: 'USD',
        symbol: '$',
        name: 'Dollar',
        country: 'United States',
        amount: 10.5
      }.with_indifferent_access
    end

    it do
      expect(response).to have_http_status :ok
      result = JSON.parse(response.body)
      expect(result).to eq body_expectation
    end
  end

  describe 'When Error happend' do
    before do
      allow_any_instance_of(CurrencyConversorService).to receive(:execute).and_raise(mock_error)

      get :convert, format: :json, params: { from: 'USD', to: 'BTC', amount: 1 }
    end

    context 'with CurrencyConversorService::CurrencyFromNotAllowed' do
      let(:mock_error) { CurrencyConversorService::CurrencyFromNotAllowed }

      let(:body_expectation) do
        {
          error: 'it\'s not permited this from currency'
        }.with_indifferent_access
      end

      it do
        expect(response).to have_http_status :bad_request
        result = JSON.parse(response.body)
        expect(result).to eq body_expectation
      end
    end

    context 'with CurrencyConversorService::CurrencyToNotAllowed' do
      let(:mock_error) { CurrencyConversorService::CurrencyToNotAllowed }

      let(:body_expectation) do
        {
          error: 'it\'s not permited this to currency'
        }.with_indifferent_access
      end

      it do
        expect(response).to have_http_status :bad_request
        result = JSON.parse(response.body)
        expect(result).to eq body_expectation
      end
    end

    context 'with Internal Error' do
      let(:mock_error) { StandardError }

      let(:body_expectation) do
        {
          error: 'Something wrong happend, try again late...'
        }.with_indifferent_access
      end

      it do
        expect(response).to have_http_status :internal_server_error
        result = JSON.parse(response.body)
        expect(result).to eq body_expectation
      end
    end
  end
end
