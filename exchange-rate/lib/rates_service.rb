# Path: exchange-rate/lib/rates_service.rb
class RatesService
    class AbstractAPIError < StandardError; end
    class FixerAPIError < StandardError; end

    def initialize(from:, to:)
        @from = from
        @to = to
        @redis_path = "#{from}:#{to}"
    end

    def get_rate
        # Check if rates are already cached
        Rails.cache.fetch(@redis_path, expires_in: 60.minutes) do
            # If not, get the rates from the external API
            # and save to cache
            begin
                rates_from_external_api
            rescue
                Rails.logger.error("Error while fetching rates from cache and external API")
            end
        end
    end

    private

    # Keeping this more general so it's easier to implement
    # external APIs redundancy if needed
    def rates_from_external_api
        # External API call
        begin
            # This is being called two times for some reason
            FixerRates.new(from: @from, to: @to).get_latest_rates
        # Redundancy in case fixerRates don't exist or service is unavailable
        rescue FixerAPIError => e
            Rails.logger.error("Error while fetching rates from Fixer API")
            AbstractRates.new(from: @from, to: @to).get_rate
        rescue AbstractAPIError => e
            Rails.logger.error("Error while fetching rates from external API")
            raise e, "Failed to retrieve exchange rates"
        end
    end
end
