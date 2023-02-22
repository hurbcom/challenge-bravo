package quoteservice.processors

import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import quoteservice.repositories.RatesRepository
import quoteservice.repositories.models.Rate
import quoteservice.web.suppliers.RatesSupplier

@Component
class RatesProcessor(
    val ratesRepository: RatesRepository,
    @Qualifier("forexSupplier") val forexSupplier: RatesSupplier,
    @Qualifier("cryptoSupplier") val cryptoSupplier: RatesSupplier
) {
    fun updateRates() {
        runCatching {
            val exchangeDataFromDatabase = ratesRepository.findAll()
            val updatedRates = mutableListOf<Rate>()
            val forexRates = forexSupplier.getRates()
            val cryptoRates = cryptoSupplier.getRates()

            exchangeDataFromDatabase.forEach { rateFromDatabase ->

                val forexRateFromSupplier = forexRates.firstOrNull { supplierRate ->
                    rateFromDatabase.symbol == supplierRate.symbol
                }

                val cryptoRateFromSupplier = cryptoRates.firstOrNull { supplierRate ->
                    rateFromDatabase.symbol == supplierRate.symbol
                }

                when {
                    forexRateFromSupplier != null -> {
                        updatedRates.add(updateRate(rateFromDatabase, forexRateFromSupplier))
                    }

                    cryptoRateFromSupplier != null -> {
                        updatedRates.add(updateRate(rateFromDatabase, cryptoRateFromSupplier))
                    }

                    else -> updatedRates.add(rateFromDatabase)
                }
            }

            updatedRates.forEach {
                ratesRepository.deleteBySymbol(it.symbol)
                ratesRepository.save(it)
            }
        }.getOrElse {
            println("Failure updating exchange rates: ${it.message}")
        }
    }

    private fun updateRate(rateFromDatabase: Rate, rateFromSupplier: Rate): Rate {
        return Rate(
            id = rateFromDatabase.id,
            toUsd = rateFromSupplier.toUsd,
            fromUsd = rateFromSupplier.fromUsd,
            symbol = rateFromDatabase.symbol,
            active = rateFromDatabase.active
        )
    }
}