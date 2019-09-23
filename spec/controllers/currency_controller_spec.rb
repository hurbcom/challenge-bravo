require 'rails_helper'

describe CurrencyController, type: :controller do
  render_views

  before { allow_any_instance_of(EuCentralBank).to receive(:update_rates) }

  describe '#create' do
    subject { post :create, format: :json, params: params_request }

    context 'when success' do
      let(:params_request) do
        { 
          currency: {
            code: 'EUR',
            symbol: '€',
            name: 'Euro',
            country: 'Euro Member'
          }
        }
      end

      before do
        allow_any_instance_of(Currency).to receive(:test_integrity_with_conversor_service)
        subject
      end

      let(:body_expectation) do
        currency = Currency.last
        {
          id: currency.id,
          name: currency.name,
          code: currency.code,
          symbol: currency.symbol,
          country: currency.country,
          definition: currency.definition,
          default: currency.default,
          created_at: currency.created_at.as_json,
          updated_at: currency.updated_at.as_json
        }.with_indifferent_access
      end

      it do
        expect(response).to have_http_status :ok
        result = JSON.parse(response.body)
        expect(result).to eq body_expectation
      end
    end

    context 'when invalid data record' do
      let(:params_request) do
        { 
          currency: {
            code: 'wrong_code_size',
            symbol: '€',
            name: 'Euro',
            country: 'Euro Member'
          }
        }
      end

      before do
        allow_any_instance_of(Currency).to receive(:test_integrity_with_conversor_service)
        subject
      end

      let(:body_expectation) do
        {
          error: 'Validation failed: Code is the wrong length (should be 3 characters)'
        }.with_indifferent_access
      end

      it do
        expect(response).to have_http_status :bad_request
        result = JSON.parse(response.body)
        expect(result).to eq body_expectation
      end
    end

    context 'when integrity error' do
      let(:params_request) do
        { 
          currency: {
            code: 'EUR',
            symbol: '€',
            name: 'Euro',
            country: 'Euro Member'
          }
        }
      end

      before do
        allow_any_instance_of(Currency).to receive(
          :test_integrity_with_conversor_service
        ).and_raise(
          Currency::CreateTestIntegrityError
        )

        subject
      end

      let(:body_expectation) do
        {
          error: 'You\'re trying to create a currency not supported by conversor service ' \
          'or can be a temporary error.'
        }.with_indifferent_access
      end

      it do
        expect(response).to have_http_status :bad_request
        result = JSON.parse(response.body)
        expect(result).to eq body_expectation
      end
    end
  end

  describe '#destroy' do
    before { subject }

    context 'with success' do
      subject do
        currency = create(:currency)
        delete :destroy, format: :json, params: { id: currency.id}
      end

      it { expect(response).to have_http_status :ok }
    end

    context 'with not found' do
      subject do
        currency = create(:currency)
        delete :destroy, format: :json, params: { id: 555 }
      end

      it { expect(response).to have_http_status :not_found }
    end

    context 'with NotAllowedToDestroyError' do
      subject do
        currency = create(:currency_ballast)
        delete :destroy, format: :json, params: { id: currency.id }
      end

      let(:body_expectation) do
        {
          error: 'You can\'t delete the Ballast!!!'
        }.with_indifferent_access
      end

      it do
        expect(response).to have_http_status :bad_request
        result = JSON.parse(response.body)
        expect(result).to eq body_expectation
      end
    end
  end

  describe '#convert' do
    before do
      allow_any_instance_of(Currency).to receive(:test_integrity_with_conversor_service)
      create(:currency_ballast)
      create(:currency_crypto_coin)
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
end
