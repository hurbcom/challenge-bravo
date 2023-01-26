class V1::RatesController < ApplicationController
    before_action :rate_to_big_decimal, only: :create

    # Amount is calculated in the other service, exchange rate only gets from Cache/Public API and returns the rate.
    # GET /v1/rates?from=USD&to=EUR
    def index
        rate = RatesService.new(to: params[:to], from: params[:from]).get_rate
        if rate
            puts "wtf #{rate}"
            render json: { rate: rate }
        else
            render json: nil, status: :internal_server_error
        end
    end

    # POST /v1/rates?currency_id=1
    def create
        # Transaction so if both rates aren't created it's reverted
        Rate.transaction do
            currency_from = Currency.find_by(code: rate_params[:from])
            currency_to = Currency.find_by(code: rate_params[:to])

            # Store both regular and inverse rate. It's a tradeoff between storage and efficiency.
            # It's also easier to scale, i.e use different buy/selling prices. Easier to change.
            currency_from.create_rate(
                to_id: currency_to.id,
                rate: rate_params[:rate],
                source: rate_params[:source]
            )
            render json: { message: "Rate created successfully." }, status: :created
        rescue => e
            render json: { errors: e }, status: :unprocessable_entity
        end
    end


    private

    def rate_params
        params.require(:rate).permit(:from, :to, :rate, :source)
    end

    def rate_to_big_decimal
        rate_params[:rate].to_d(10)
    end

end
