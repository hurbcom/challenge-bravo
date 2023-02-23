package quoteservice.web.suppliers

import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.result.Result
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import quoteservice.exceptions.SupplierException
import quoteservice.loggers.Logger
import quoteservice.mappers.ObjectMapper
import quoteservice.repositories.models.Rate
import quoteservice.web.entities.responses.coincap.CoinCapResponse

@Component
@Qualifier("cryptoSupplier")
class CoinCapSupplier(
    val objectMapper: ObjectMapper,
    val logger: Logger
) : RatesSupplier {
    override fun getRates(): List<Rate> {
        runCatching {
            val (_, _, result) = Fuel.get(RATES_API_URI).header(USER_AGENT_HEADER, USER_AGENT_HEADER_VALUE)
                .responseString()

            return when (result) {
                is Result.Success -> {
                    objectMapper.jacksonMapper.readValue(
                        result.component1(),
                        CoinCapResponse::class.java
                    ).toRates()
                }

                else -> {
                    logger.kLogger.error { "Exception when getting rates from Coincap: ${result.component2()}" }
                    throw SupplierException(" CoinCap supplier get rates error ")
                }
            }
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
