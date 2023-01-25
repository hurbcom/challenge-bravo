class V1::CurrencyController < ApplicationController
    # POST /v1/currencies
    def create
        currency = Currency.new(currency_params)
        if currency.save
            render json: currency
        else
            render json: currency.errors, status: :unprocessable_entity
        end
    end

    # DELETE /v1/currencies/:id
    def destroy
        currency = Currency.find(params[:id])
        currency.destroy
        head :no_content
    end

    # PATCH /v1/currencies/:id
    def update
        currency = Currency.find(params[:id])
        if currency.update(currency_params)
            render json: currency
        else
            render json: currency.errors, status: :unprocessable_entity
        end
    end


    private

    def currency_params
        params.require(:currency).permit(:name, :code)
    end

end
