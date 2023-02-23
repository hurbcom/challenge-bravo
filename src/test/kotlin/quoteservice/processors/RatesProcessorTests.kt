package quoteservice.processors

import mu.KotlinLogging
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.mockito.Mockito
import quoteservice.loggers.Logger
import quoteservice.repositories.RatesRepository
import quoteservice.repositories.models.Rate
import quoteservice.stubs.RatesStubs
import quoteservice.web.suppliers.CoinCapSupplier
import quoteservice.web.suppliers.ExchangeRateSupplier
import quoteservice.web.suppliers.RatesSupplier

class RatesProcessorTests {
    val ratesRepository = Mockito.mock(RatesRepository::class.java)
    val forexSupplier = Mockito.mock(ExchangeRateSupplier::class.java) as RatesSupplier
    val crytoSupplier = Mockito.mock(CoinCapSupplier::class.java) as RatesSupplier
    val logger = Logger(kLogger = KotlinLogging.logger {})
    val ratesStubs = RatesStubs()
    val RatesProcessor = RatesProcessor(ratesRepository, logger, forexSupplier, crytoSupplier)

    @Test
    fun `when updating rates the number of save and deleteBySymbol calls should be equal to the number of rates previously in database`() {
        Mockito.`when`(ratesRepository.findAll()).thenReturn(
            listOf(
                ratesStubs.getUsdRate(),
                ratesStubs.getBrlRate(),
                ratesStubs.getBtcRate(),
                ratesStubs.getPsnRate()
            )
        )
        Mockito.`when`(forexSupplier.getRates())
            .thenReturn(listOf(ratesStubs.getUsdRate(), ratesStubs.getUpdatedBrlRate(), ratesStubs.getAudRate()))
        Mockito.`when`(crytoSupplier.getRates()).thenReturn(listOf(ratesStubs.getBtcRate(), ratesStubs.getEthRate()))

        assertDoesNotThrow {
            RatesProcessor.updateRates()
        }.also {
            Mockito.verify(ratesRepository, Mockito.times(1)).deleteBySymbol(ratesStubs.getUsdRate().symbol)
            Mockito.verify(ratesRepository, Mockito.times(1)).deleteBySymbol(ratesStubs.getBrlRate().symbol)
            Mockito.verify(ratesRepository, Mockito.times(1)).deleteBySymbol(ratesStubs.getBtcRate().symbol)
            Mockito.verify(ratesRepository, Mockito.times(1)).deleteBySymbol(ratesStubs.getPsnRate().symbol)
            Mockito.verify(ratesRepository, Mockito.times(4)).save(Mockito.any(Rate::class.java))
        }
    }

}