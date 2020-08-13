require 'rest-client'

module Converter
  module Services
    class CryptocompareApi
      BASE_URL = "https://min-api.cryptocompare.com/data/price"

      def self.build
        http_client = RestClient
        api_key = ENV['CRYPTOCOMPARE_API_KEY']
        new(base_url: BASE_URL, http_client: http_client, api_key: api_key)
      end

      def initialize(base_url:, http_client:, api_key:)
        @base_url = base_url
        @http_client = http_client
        @api_key = api_key
      end

      def get_exchange_rate(from:, to:, ballast:)
        begin
          url = build_request_url(from: from, to: to, ballast: ballast)
          response = @http_client.get(url)
          parsed_body = JSON.parse(response.body)
          return Converter::Domain::Quotation.new(from: from, to: to, ballast: ballast, response: parsed_body)
        rescue RestClient::Exceptions::Timeout
          raise Converter::Exceptions::CryptocompareApiTimeOutException.new
        rescue RestClient::Unauthorized
          raise Converter::Exceptions::CryptocompareApiUnauthorizedException.new
        rescue RestClient::NotFound
          raise Converter::Exceptions::CryptocompareApiNotFoundException.new
        end
      end

      private

      def build_request_url(from:, to:, ballast:)
        @base_url + "?fsym=#{from}&tsyms=#{to},#{ballast}&api_key=#{@api_key}"
      end

    end
  end
end