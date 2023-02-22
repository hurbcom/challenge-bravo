package quoteservice.web.suppliers

import com.github.kittinunf.fuel.Fuel
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import quoteservice.mappers.ObjectMapper
import quoteservice.repositories.models.Rate
import quoteservice.web.entities.responses.exchangerate.ExchangeRateResponse

@Component
@Qualifier("forexSupplier")
class ExchangeRateSupplier(
    val objectMapper: ObjectMapper
): RatesSupplier {
    override fun getRates(): List<Rate> {
        runCatching {
            return Fuel.get(EXCHANGE_RATES_API_FOREX_QUOTES_USD_BASE_URI).let {
                objectMapper.jacksonMapper.readValue(
                    it.responseString().third.component1(),
                    ExchangeRateResponse::class.java
                )
            }.toRates()
        }.getOrElse {
            throw it
        }
    }

    companion object {
        const val EXCHANGE_RATES_API_FOREX_QUOTES_USD_BASE_URI = "https://api.exchangerate.host/latest?base=USD"
    }
}
