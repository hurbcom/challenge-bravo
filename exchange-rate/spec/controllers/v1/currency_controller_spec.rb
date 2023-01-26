# frozen_string_literal: true

require 'rails_helper'

RSpec.describe V1::CurrencyController, type: :controller do

    describe 'GET #index' do
        let!(:currencies) { FactoryBot.create_list(:currency, 3) }

        before { get :index }

        it { expect(response).to have_http_status(:ok) }

        it 'should return all currencies' do
            expect(response.parsed_body.size).to eq(currencies.size)
        end
    end

    describe 'GET #show' do
        let!(:currency) { FactoryBot.create(:currency) }

        it 'returns currency' do
            get :show, params: { id: currency.id }

            expect(response).to have_http_status(:ok)
        end

        it 'should return 404 if no currency' do
            get :show, params: { id: Faker::Number }

            expect(response).to have_http_status(:not_found)
        end
    end

  describe 'POST #create' do
    let(:currency) { FactoryBot.build(:currency) }

    context 'when currency is valid' do
      before { post :create, params: { currency: currency.attributes } }

      it { expect(response).to have_http_status(:created) }
    end

    context 'when currency is invalid' do
      before { post :create, params: { currency: { name: currency.name } } }

      it { expect(response).to have_http_status(:unprocessable_entity) }
    end
  end

  describe 'DELETE #destroy' do
    let!(:currency) { FactoryBot.create(:currency) }

    before { delete :destroy, params: { id: currency.id } }

    it { expect(response).to have_http_status(:no_content) }
    it { expect(response.body).to be_empty }
  end

  describe 'PATCH #update' do
    let!(:currency) { FactoryBot.create(:currency) }
    let(:currency2) { FactoryBot.build(:currency) }

    context 'when currency is valid' do
      before { patch :update, params: { id: currency.id, currency: currency2.attributes } }

      it { expect(response).to have_http_status(:ok) }
    end
end

    after(:all) do
        Currency.delete_all
    end

end
