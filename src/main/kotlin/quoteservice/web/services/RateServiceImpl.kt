package quoteservice.web.services

import org.springframework.stereotype.Service
import quoteservice.exceptions.CurrencyAlreadyAddedException
import quoteservice.exceptions.CurrencyNotFoundException
import quoteservice.exceptions.UnsupportedCurrencyException
import quoteservice.loggers.Logger
import quoteservice.repositories.RatesRepository
import quoteservice.repositories.models.Rate
import quoteservice.web.entities.requests.AddCurrencyRequest
import quoteservice.web.entities.responses.ConversionResponse
import java.math.BigDecimal

@Service
class RateServiceImpl(
    val ratesRepository: RatesRepository,
    val logger: Logger
) : RateService {
    override fun convert(baseCurrencySymbol: String, targetCurrencySymbol: String, amount: String): ConversionResponse {
        runCatching {
            logger.kLogger.info { "Starting to process covert currency request" }

            val exchangeDataFromDatabase = ratesRepository.findAll()

            val fromCurrencyUsdRate = getCurrencyRate(baseCurrencySymbol, exchangeDataFromDatabase).toUsd.toBigDecimal()

            val toCurrencyUsdRate =
                getCurrencyRate(targetCurrencySymbol, exchangeDataFromDatabase).fromUsd.toBigDecimal()

            return ConversionResponse(
                amount = calculateConversion(fromCurrencyUsdRate, toCurrencyUsdRate, amount.toBigDecimal()).toString(),
                currency = targetCurrencySymbol
            ).also { logger.kLogger.info { "Convert request processing finished with success" } }
        }.getOrElse {
            logger.kLogger.info { "Error converting amount: $amount from currency: $baseCurrencySymbol to: $targetCurrencySymbol" }
            throw it
        }
    }

    override fun add(request: AddCurrencyRequest) {
        runCatching {
            logger.kLogger.info { "Starting to process add currency request" }

            val rateFromDatabase = ratesRepository.findBySymbol(request.symbol)

            if (rateFromDatabase != null && rateFromDatabase.active) {
                throw CurrencyAlreadyAddedException("Currency already exists and is active in database")
            }

            val newRate = if (rateFromDatabase != null && !rateFromDatabase.active) {
                ratesRepository.deleteBySymbol(request.symbol)
                Rate(
                    id = rateFromDatabase.id,
                    symbol = rateFromDatabase.symbol,
                    toUsd = request.toUsd,
                    fromUsd = request.fromUsd,
                    active = true
                )
            } else {
                Rate(
                    symbol = request.symbol,
                    toUsd = request.toUsd,
                    fromUsd = request.fromUsd,
                    active = true
                )
            }

            ratesRepository.save(newRate)
                .also { logger.kLogger.info { "Add currency request processing finished with success" } }
        }.getOrElse {
            logger.kLogger.error { "Exception at adding currency: ${it.message}" }
            throw it
        }
    }

    override fun delete(currencySymbol: String) {
        runCatching {
            logger.kLogger.info { "Starting to process delete currency request" }

            val rateFromDatabase = ratesRepository.findBySymbol(currencySymbol)
                ?: throw CurrencyNotFoundException("Currency not found in database")

            if (!rateFromDatabase.active) throw UnsupportedCurrencyException("Currency is already deactivated")

            ratesRepository.deleteBySymbol(currencySymbol)
            ratesRepository.save(
                Rate(
                    id = rateFromDatabase.id,
                    symbol = rateFromDatabase.symbol,
                    toUsd = rateFromDatabase.toUsd,
                    fromUsd = rateFromDatabase.fromUsd,
                    active = false
                )
            ).also { logger.kLogger.info { "Delete currency request processing finished with success" } }

        }.getOrElse {
            logger.kLogger.error { "Exception at deleting currency $currencySymbol: ${it.message}" }
            throw it
        }
    }

    private fun getCurrencyRate(currencySymbol: String, rates: List<Rate>): Rate {
        return rates.firstOrNull {
            it.symbol == currencySymbol && it.active
        }.let {
            it ?: throw UnsupportedCurrencyException("Currently the currency $currencySymbol is not supported").also {
                logger.kLogger.error { "Attempted to get currency rate of an unsupported currency: $currencySymbol" }
            }
        }
    }


    private fun calculateConversion(
        fromCurrencyUsdRate: BigDecimal,
        toCurrencyUsdRate: BigDecimal,
        amount: BigDecimal
    ): BigDecimal {
        return ((fromCurrencyUsdRate * toCurrencyUsdRate) * amount).let {
            if (it > BigDecimal.ONE) {
                it.setScale(SCALE_OF_TWO, BigDecimal.ROUND_HALF_EVEN)
            } else {
                it.setScale(SCALE_OF_SIX, BigDecimal.ROUND_HALF_EVEN)
            }
        }
    }

    companion object {
        const val SCALE_OF_TWO = 2
        const val SCALE_OF_SIX = 6
    }
}