package quoteservice.web.suppliers

import com.github.kittinunf.fuel.Fuel
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import quoteservice.mappers.ObjectMapper
import quoteservice.repositories.models.Rate
import quoteservice.web.entities.responses.coincap.CoinCapResponse

@Component
@Qualifier("cryptoSupplier")
class CoinCapSupplier(
    val objectMapper: ObjectMapper
): RatesSupplier {
    override fun getRates(): List<Rate> {
        runCatching {
            return Fuel.get(RATES_API_URI).header(USER_AGENT_HEADER, USER_AGENT_HEADER_VALUE).let {
                objectMapper.jacksonMapper.readValue(
                    it.responseString().third.component1(),
                    CoinCapResponse::class.java
                )
            }.toRates()
        }.getOrElse {
            throw it
        }
    }
    companion object {
        const val RATES_API_URI = "https://api.coincap.io/v2/rates"
        const val USER_AGENT_HEADER = "User-Agent"
        const val USER_AGENT_HEADER_VALUE = "Mozilla/5.0"
    }
}
