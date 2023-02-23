package quoteservice.web.entities.responses.coincap

import quoteservice.repositories.models.Rate

data class CoinCapResponse(
    val data: List<CoinCapRate>
){
    fun toRates(): List<Rate> {
        val convertedRates = mutableListOf<Rate>()

        data.filter { it.type == CRYPTO_CURRENCY_TYPE }.forEach { convertedRates.add(it.convert()) }

        return convertedRates
    }

    companion object {
        const val CRYPTO_CURRENCY_TYPE = "crypto"
    }
}
