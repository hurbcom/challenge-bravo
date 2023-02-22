package quoteservice.web.services

import org.springframework.stereotype.Service
import quoteservice.exceptions.CurrencyAlreadyAddedException
import quoteservice.exceptions.UnsupportedCurrencyException
import quoteservice.repositories.RatesRepository
import quoteservice.repositories.models.Rate
import quoteservice.web.entities.requests.AddCurrencyRequest
import quoteservice.web.entities.responses.ConversionResponse
import java.math.BigDecimal

@Service
class RateServiceImpl(
    val ratesRepository: RatesRepository
) : RateService {
    override fun convert(baseCurrencySymbol: String, targetCurrencySymbol: String, amount: String): ConversionResponse {
        runCatching {
            val exchangeDataFromDatabase = ratesRepository.findAll()

            val fromCurrencyUsdRate = getCurrencyRate(baseCurrencySymbol, exchangeDataFromDatabase).toUsd.toBigDecimal()

            val toCurrencyUsdRate =
                getCurrencyRate(targetCurrencySymbol, exchangeDataFromDatabase).fromUsd.toBigDecimal()

            return ConversionResponse(
                amount = calculateConversion(fromCurrencyUsdRate, toCurrencyUsdRate, amount.toBigDecimal()).toString(),
                currency = targetCurrencySymbol
            )
        }.getOrElse {
            throw it
        }
    }

    override fun add(request: AddCurrencyRequest) {
        runCatching {
            ratesRepository.findBySymbol(request.symbol).let {
                if(it != null) throw CurrencyAlreadyAddedException("Currency already exists in database")
            }

            ratesRepository.save(
                Rate(
                    symbol = request.symbol,
                    toUsd = request.toUsd,
                    fromUsd = request.fromUsd,
                    active = true
                )
            )
        }.getOrElse {
            print("Exception at adding currency: ${it.message}")
            throw it
        }
    }

    private fun getCurrencyRate(currencySymbol: String, rates: List<Rate>): Rate {
        return rates.firstOrNull {
            it.symbol == currencySymbol && it.active
        }.let {
            it ?: throw UnsupportedCurrencyException("Currently the currency $currencySymbol is not supported")
        }
    }

    private fun calculateConversion(
        fromCurrencyUsdRate: BigDecimal,
        toCurrencyUsdRate: BigDecimal,
        amount: BigDecimal
    ): BigDecimal {
        return ((fromCurrencyUsdRate * toCurrencyUsdRate) * amount).let {
            if(it > BigDecimal.ONE){
                it.setScale(SCALE_OF_TWO, BigDecimal.ROUND_HALF_EVEN)
            }
            else {
                it.setScale(SCALE_OF_SIX, BigDecimal.ROUND_HALF_EVEN)
            }
        }
    }

    companion object {
        const val SCALE_OF_TWO = 2
        const val SCALE_OF_SIX = 6
    }
}