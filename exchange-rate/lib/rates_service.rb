# Path: exchange-rate/lib/rates_service.rb
class RatesService
    def initialize(from:, to:)
        @from = from
        @to = to
        @redis_path = "#{from}:#{to}"
    end

    def get_rate
        # Check if rates are already cached
        Rails.cache.fetch(@redis_path) do
            # If not, get the rates from the external API
            rates_from_external_api
        end
    end

    private

    # Keeping this more general so it's easier to implement
    # external APIs redundancy if needed
    def rates_from_external_api
        # External API call
        FixerRates.new(from: @from, to: @to).get_latest_rates
    end
end
