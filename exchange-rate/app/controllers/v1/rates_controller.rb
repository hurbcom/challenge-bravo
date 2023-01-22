class V1::RatesController < ApplicationController

    # Amount is calculated in the other service, exchange rate only gets from Cache/Public API and returns the rate.
    def index
        # This needs to go into the model!
        rate = RatesService.new(to: params[:to], from: params[:from]).get_rate
        if rate
            render json: { rate: rate  }
        else
            render json: nil, status: :internal_server_error
        end
    end
end
