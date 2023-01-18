class V1::RatesController < ApplicationController

    # Amount is calculated in the other service, exchange rate only gets from Cache/Public API and returns the rate.
    def index
        render json: { rate: RatesService.new(to: params[:to], from: params[:from]).get_rate }
    end
end
