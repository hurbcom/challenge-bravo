package quoteservice.web.services

import quoteservice.web.entities.requests.AddCurrencyRequest
import quoteservice.web.entities.responses.ConversionResponse

interface RateService {
    fun convert(baseCurrencySymbol: String, targetCurrencySymbol: String, amount: String): ConversionResponse
    fun add(request: AddCurrencyRequest)
}