package quoteservice.web.suppliers

import com.github.kittinunf.fuel.httpGet
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component

@Component
@Qualifier("forexSupplier")
class ForexExchangeRateSupplier: RatesSupplier {
    override fun getForexRates() {
        runCatching {
            val (_, _, result) = SUPPLIER_FOREX_QUOTES_USD_BASE_URI.httpGet().responseString()
        }
    }

    companion object {
        const val SUPPLIER_FOREX_QUOTES_USD_BASE_URI = "https://api.exchangerate.host/latest?base=USD"
    }
}
