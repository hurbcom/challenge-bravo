class V1::RatesController < ApplicationController
    # Amount is calculated in the other service, exchange rate only gets from Cache/Public API and returns the rate.
    # GET /v1/rates?from=USD&to=EUR
    def index
        # This needs to go into the model!
        rate = RatesService.new(to: params[:to], from: params[:from]).get_rate
        if rate
            render json: { rate: rate }
        else
            render json: nil, status: :internal_server_error
        end
    end

    # POST /v1/rates?currency_id=1
    def create
        currency = Currency.find(params[:currency_id])
        if currency.create_rate(rate_params)
            render json: { message: "Rate created successfully." }, status: :created
        else
            render json: { errors: currency.errors }, status: :unprocessable_entity
        end
    end

    private

    def rate_params
        params.require(:rate).permit(:from, :to, :rate, :source)
    end

end
