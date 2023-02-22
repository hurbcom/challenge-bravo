package quoteservice.web.suppliers

import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.result.Result.Success
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import quoteservice.mappers.ObjectMapper
import quoteservice.repositories.models.Rate
import quoteservice.web.entities.responses.exchangerate.ExchangeRateResponse

@Component
@Qualifier("forexSupplier")
class ExchangeRateSupplier(
    val objectMapper: ObjectMapper
) : RatesSupplier {
    override fun getRates(): List<Rate> {
        runCatching {
            val (_, _, result) = Fuel.get(EXCHANGE_RATES_API_FOREX_QUOTES_USD_BASE_URI)
                .header("Accept", "application/json")
                .responseString()

            return when (result) {
                is Success -> {
                    objectMapper.jacksonMapper.readValue(
                        result.component1(),
                        ExchangeRateResponse::class.java
                    ).toRates()
                }

                else -> throw Exception(result.component2())
            }
        }.getOrElse {
            throw it
        }
    }

    companion object {
        const val EXCHANGE_RATES_API_FOREX_QUOTES_USD_BASE_URI = "https://api.exchangerate.host/latest?base=USD"
    }
}
