package quoteservice.web.entities.responses.exchangerate

import quoteservice.repositories.models.Rate
import quoteservice.web.entities.Rates

data class ExchangeRateResponse (
    val success: String,
    val base: String,
    val date: String,
    val rates: Rates
) {
    fun toRates(): List<Rate> {
        return rates.convert()
    }
}
