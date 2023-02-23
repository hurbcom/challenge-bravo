package quoteservice.web.entities.responses.coincap

import quoteservice.repositories.models.Rate
import quoteservice.web.entities.Rates
import java.math.BigDecimal
import java.math.RoundingMode.HALF_EVEN

data class CoinCapRate(
    val id: String,
    val symbol: String,
    val currencySymbol: String?,
    val type: String,
    val rateUsd: String
) {
    fun convert(): Rate {
        val toUsd = rateUsd.toBigDecimal().setScale(SCALE, HALF_EVEN)
        val fromUsd = BigDecimal(1.0).setScale(Rates.SCALE, BigDecimal.ROUND_HALF_EVEN) / toUsd

        return Rate(symbol = symbol, toUsd = toUsd.toString(), fromUsd = fromUsd.toString())
    }

    companion object {
        const val SCALE = 6
    }
}
