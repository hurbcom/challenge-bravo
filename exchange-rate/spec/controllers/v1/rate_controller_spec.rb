# frozen_string_literal: true

require 'rails_helper'

RSpec.describe V1::RatesController, type: :controller do

    describe 'POST #create' do
        context 'when rate is valid' do
            before do
                FactoryBot.create(:currency, { code: 'BRL', name: 'Real'})
                FactoryBot.create(:currency, { code: 'DOT', name: 'Polkadot'})
            end


            it 'creates rate' do
                post :create, params: { rate: {
                    rate: 2.5,
                    from: 'BRL',
                    to: 'DOT'
                } }

                expect(response).to have_http_status(:created)
            end
        end
    end

    describe 'GET #index' do
        before do
            FactoryBot.create(:currency, { code: 'BRL', name: 'Real'})
            FactoryBot.create(:currency, { code: 'DOT', name: 'Polkadot'})
        end

        context 'when rate is cached' do
            before do
                allow(Rails.cache).to receive(:fetch).with('BRL:USD', any_args).and_return(5.29)
            end

            it 'returns rate from cache' do
                get :index, params: { from: 'BRL', to: 'USD' }

                expect(FixerRates).not_to receive(:new)
                expect(AbstractRates).not_to receive(:new)
                expect(Rate).not_to receive(:where)

                expect(response).to have_http_status(:ok)
                expect(response.parsed_body['rate']).to eq(5.29)
            end
        end

        context 'when rate is not cached' do
            before do
                Rails.cache.clear
            end

            describe 'get data from external' do
                before do
                    allow_any_instance_of(FixerRates).to receive(:get_latest_rates).and_return(5.29)
                end

                it 'rate is returned from FixerAPI' do
                    get :index, params: { from: 'BRL', to: 'USD' }

                    expect(AbstractRates).not_to receive(:new)
                    expect(Rate).not_to receive(:where)

                    expect(response).to have_http_status(:ok)
                    expect(response.parsed_body['rate']).to eq(5.29)
                end

                context 'Fixer API fails' do
                    describe 'Abstract API is used' do
                        before do
                            allow_any_instance_of(FixerRates).to receive(:get_latest_rates).and_raise(RatesService::FixerAPIError)
                            allow_any_instance_of(AbstractRates).to receive(:get_rate).and_return(5.29)

                        end

                        it 'rate is returned from AbstractAPI' do
                            get :index, params: { from: 'BRL', to: 'USD' }

                            expect(Rate).not_to receive(:where)

                            expect(response).to have_http_status(:ok)
                            expect(response.parsed_body['rate']).to eq(5.29)
                        end

                        context 'Abstract API fails' do
                            describe 'Rate is searched from the DB' do
                                before do
                                    allow_any_instance_of(AbstractRates).to receive(:get_rate).and_raise(RatesService::AbstractAPIError)
                                    from_currency = FactoryBot.create(:currency, { code: 'LINK', name: 'Chainlink'})
                                    to_currency = FactoryBot.create(:currency, { code: 'ETH', name: 'Ethereum'})
                                    FactoryBot.create(:rate, { rate: 5.29, from_currency_id: from_currency.id, to_currency_id: to_currency.id })
                                end

                                it 'rate is returned from the DB' do
                                    get :index, params: { from: 'LINK', to: 'ETH' }

                                    expect(response).to have_http_status(:ok)
                                    expect(response.parsed_body['rate']).to eq("5.29")
                                end

                                context 'Rate is not found in the DB' do
                                    describe 'Rate is not returned' do
                                        it 'rate is not returned' do
                                            get :index, params: { from: 'ABC', to: 'USD' }

                                            expect(response).to have_http_status(:not_found)
                                        end
                                    end
                                end
                            end
                        end
                    end
                end
            end
        end


        # before { get :index }

        # it { expect(response).to have_http_status(:ok) }

        # it 'should return all rates' do
        #     expect(response.parsed_body.size).to eq(rates.size)
        # end
    end

end
