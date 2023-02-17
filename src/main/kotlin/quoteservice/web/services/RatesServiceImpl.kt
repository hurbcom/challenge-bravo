package quoteservice.web.services

import org.springframework.stereotype.Service
import quoteservice.repositories.ExchangeDataRepository
import quoteservice.repositories.models.ExchangeData
import quoteservice.repositories.models.Rate
import quoteservice.web.entities.responses.ConversionResponse

@Service
class RatesServiceImpl(
    val exchangeDataRepository: ExchangeDataRepository
) {
    fun convert(baseCurrencySymbol: String, targetCurrencySymbol: String): ConversionResponse {
        runCatching {
            val exchangeDataFromDatabase = exchangeDataRepository.findAll()
            val fromCurrencyUsdRate = getCurrencyRate(baseCurrencySymbol, exchangeDataFromDatabase[0]).toUsd.toDouble()
            val toCurrencyUsdRate =
                getCurrencyRate(targetCurrencySymbol, exchangeDataFromDatabase[0]).fromUsd.toDouble()

            return ConversionResponse(
                amount = (fromCurrencyUsdRate * toCurrencyUsdRate).toString(),
                currency = targetCurrencySymbol
            )
        }.getOrElse {
            throw it
        }
    }

    fun add() {
        TODO()
        //exchangeDataRepository.save()
    }

    private fun getCurrencyRate(currencySymbol: String, exchangeData: ExchangeData): Rate {
        return exchangeData.rates.firstOrNull {
            it.symbol == currencySymbol
        }.let {
            it ?: throw Exception()
        }
    }
}