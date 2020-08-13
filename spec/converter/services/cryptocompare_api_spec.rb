require 'spec_helper'
require 'json'
require 'rest-client'

describe Converter::Services::CryptocompareApi do
  let(:http_client) { double("RestClient")}
  let(:api_key) { "42respostaparatudo"}
  let(:base_url) { "https://min-api.cryptocompare.com/data/price" }
  let(:from) { :EUR }
  let(:to) { :BRL }
  let(:ballast) { :USD }
  let(:quotation) { Converter::Domain::Quotation }
  let(:url) { base_url + "?fsym=#{from}&tsyms=#{to},#{ballast}&api_key=#{api_key}" }
  let(:api) {
    described_class.new(
      base_url: base_url,
      http_client: http_client,
      api_key: api_key
    )
  }

  describe '#get_exchange_rate' do
    context 'when api responds with a valid body' do
      let(:response) {
        instance_double(RestClient::Response,
          body: {
            USD: 424.42,
            BRL: 42.42,
          }.to_json)
      }
      before do
        allow(api).to receive(:build_request_url).with(from: from, to: to, ballast: ballast).and_return(url)
        allow(http_client).to receive(:get).with(url).and_return(response)
        allow(quotation).to receive(:new).with(from: from, to: to, ballast: ballast, response: JSON.parse(response.body))
      end

      after do
        api.get_exchange_rate(from: from, to: to, ballast: ballast)
      end

      it "fetches the conversion rate" do
        expect(api).to receive(:build_request_url).with(from: from, to: to, ballast: ballast).and_return(url)
        expect(http_client).to receive(:get).with(url).and_return(response)
        expect(quotation).to receive(:new).with(from: from, to: to, ballast: ballast, response: JSON.parse(response.body))
      end
    end

    context 'when api time out' do
      let(:error) { RestClient::Exceptions::Timeout }
      before do
        allow(api).to receive(:build_request_url).with(from: from, to: to, ballast: ballast).and_return(url)
        allow(http_client).to receive(:get).with(url).and_raise(error)
      end

      it "raises time out error" do
        expect{ api.get_exchange_rate(from: from, to: to, ballast: ballast) }.to raise_error(Converter::Exceptions::CryptocompareApiTimeOutException)
      end
    end

    context 'when api request is unauthorized' do
      let(:error) { RestClient::Unauthorized}
      before do
        allow(api).to receive(:build_request_url).with(from: from, to: to, ballast: ballast).and_return(url)
        allow(http_client).to receive(:get).with(url).and_raise(error)
      end

      it "raises unauthorized" do
        expect{ api.get_exchange_rate(from: from, to: to, ballast: ballast) }.to raise_error(Converter::Exceptions::CryptocompareApiUnauthorizedException)
      end
    end

    context 'when endpoint was not found' do
      let(:error) { RestClient::NotFound }
      before do
        allow(api).to receive(:build_request_url).with(from: from, to: to, ballast: ballast).and_return(url)
        allow(http_client).to receive(:get).with(url).and_raise(error)
      end

      it "raises not found error" do
        expect{ api.get_exchange_rate(from: from, to: to, ballast: ballast) }.to raise_error(Converter::Exceptions::CryptocompareApiNotFoundException)
      end
    end
  end
end
