class V1::CurrencyController < ApplicationController

    # GET /v1/currency
    def index
        currencies = Currency.all
        render json: currencies
    end

    # GET /v1/currency/:id
    def show
        currency = Currency.includes(:rates).find(params[:id])
        render json: currency
    end

    # POST /v1/currency
    def create
        currency = Currency.new(currency_params)
        if currency.save
            render json: currency, status: :created
        else
            render json: currency.errors, status: :unprocessable_entity
        end
    end

    # DELETE /v1/currency/:id
    def destroy
        currency = Currency.find(params[:id])
        currency.destroy
        head :no_content
    end

    # PATCH /v1/currency/:id
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
