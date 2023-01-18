class FixerRates
    def initialize(from:, to:)
        @from = from
        @to = to
    end

    def get_latest_rates
        begin
            response = conn.get('latest', {base: @from, symbols: @to})
        rescue
            raise  Faraday::ClientError, "Error while fetching rates from Fixer API"
        end
        if response.status != 200
            raise  Faraday::ClientError, "Response status was #{response.status}"
        end

        JSON.parse(response.body)['rates'][@to]
    end

    private

    def conn
        conn = Faraday.new(
            url: ENV['FIXER_URL'],
            headers: {
                'apikey' =>  ENV['FIXER_API_KEY']
            }
        )
    end

end
