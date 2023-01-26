# Path: exchange-rate/lib/rates_service.rb
class RatesService
    class AbstractAPIError < StandardError; end
    class FixerAPIError < StandardError; end
    class ExternalAPIError < StandardError; end

    CACHE_EXPIRATION = ENV['CACHE_EXPIRATION'] || 60.minutes

    def initialize(from:, to:)
        @from = from
        @to = to
        @redis_path = "#{from}:#{to}"
    end

    def get_rate
        # Check if rates are already cached
        # Cache lives 60 minutes, as it usually takes to update external services
        Rails.cache.fetch(@redis_path, expires_in: CACHE_EXPIRATION) do
            # If not cached, try to get in from the DB.
            # If not, get the rates from the external API
            # and save to cache
            begin
                # It's possible to change routes here, this is done considering that most of
                # currency call are going to external sources instead of DB.
                rates_from_external_api
            rescue ExternalAPIError => e
                # If external API fails, try to get the rates from the DB
                # If not, return nil - nil is also cached to avoid multiple complex calls
                get_rates_from_db
            rescue
                Rails.logger.error("Error while fetching rates")
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
            begin
                AbstractRates.new(from: @from, to: @to).get_rate
            rescue
                Rails.logger.error("Error while fetching rates from external API")
                raise ExternalAPIError, "Failed to retrieve exchange rates from external APIs"
            end
        end
    end

    def get_rates_from_db
        # Subquery to get ids - best than join since we only need the id.
        from_currency_subquery = Currency.where(code: @from).select(:id)
        to_currency_subquery = Currency.where(code: @to).select(:id)

        Rate.where(from_currency_id: from_currency_subquery, to_currency_id: to_currency_subquery)
            .order("date DESC").first.try(:rate)
    end
end
