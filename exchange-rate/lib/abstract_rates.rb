class AbstractRates
    def initialize(from:, to:)
        @from = from
        @to = to
    end

    def get_rate
        begin
            response = conn.get('live/', {base: @from, target: @to})
        rescue
            raise  RatesService::AbstractAPIError, "Error while fetching rates from Abstract API"
        end
        if response.status != 200
            raise  RatesService::AbstractAPIError, "Response status was #{response.status}"
        end

        JSON.parse(response.body)['exchange_rates'][@to]
    end

    private

    def conn
        conn = Faraday.new(
            url: ENV['ABSTRACT_URL'],
            params: {
                'api_key' =>  ENV['ABSTRACT_API_KEY']
            }
        )
    end

end
