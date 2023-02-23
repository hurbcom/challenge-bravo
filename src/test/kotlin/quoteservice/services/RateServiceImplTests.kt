package quoteservice.services

import mu.KotlinLogging
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.mockito.Mockito.mock
import org.mockito.Mockito.`when`
import org.mockito.Mockito.verify
import org.mockito.Mockito.times
import org.mockito.Mockito.any
import quoteservice.exceptions.CurrencyAlreadyAddedException
import quoteservice.exceptions.CurrencyNotFoundException
import quoteservice.exceptions.UnsupportedCurrencyException
import quoteservice.loggers.Logger
import quoteservice.repositories.RatesRepository
import quoteservice.repositories.models.Rate
import quoteservice.stubs.RatesStubs
import quoteservice.web.entities.requests.AddCurrencyRequest
import quoteservice.web.services.RateServiceImpl


class RateServiceImplTests {

    val ratesRepository = mock(RatesRepository::class.java)
    val logger = Logger(kLogger = KotlinLogging.logger {})
    val rateServiceImpl = RateServiceImpl(ratesRepository, logger)
    val ratesStubs = RatesStubs()

    @Test
    fun `when atempting to convert currencies when everything is ok then conversion must be performed`() {
        `when`(ratesRepository.findAll()).thenReturn(listOf(ratesStubs.getUsdRate(), ratesStubs.getBrlRate()))

        assertDoesNotThrow {
            rateServiceImpl.convert(
                baseCurrencySymbol = "BRL",
                targetCurrencySymbol = "USD",
                amount = "100"
            )
        }.also {
            assertEquals("USD", it.currency)
            assertEquals("19.36", it.amount)
        }
    }

    @Test
    fun `when atempting to convert currencies if everything is ok but quote needs more digits on the scale then conversion must be performed accordingly`() {
        `when`(ratesRepository.findAll()).thenReturn(listOf(ratesStubs.getUsdRate(), ratesStubs.getBtcRate()))

        assertDoesNotThrow {
            rateServiceImpl.convert(
                baseCurrencySymbol = "USD",
                targetCurrencySymbol = "BTC",
                amount = "100"
            )
        }.also {
            assertEquals("BTC", it.currency)
            assertEquals("0.004000", it.amount)
        }
    }

    @Test
    fun `when atempting to convert unsupported currencies if one of the currencies are not valid then UnsupportedCurrencyException must be thrown`() {
        `when`(ratesRepository.findAll()).thenReturn(listOf(ratesStubs.getUsdRate(), ratesStubs.getBrlRate()))

        assertThrows<UnsupportedCurrencyException> {
            rateServiceImpl.convert(
                baseCurrencySymbol = "USD",
                targetCurrencySymbol = "XXX",
                amount = "100"
            )
        }
    }

    @Test
    fun `when atempting to add a new currency if everything is ok and it is not on database than it should be added to database`() {
        `when`(ratesRepository.findBySymbol("PSN")).thenReturn(null)

        val addCurrencyRequest = AddCurrencyRequest(symbol = "PSN", toUsd = "0.823454", fromUsd = "1.214396")

        assertDoesNotThrow {
            rateServiceImpl.add(addCurrencyRequest)
        }.also {
            verify(ratesRepository, times(1)).save(any(Rate::class.java))
        }
    }

    @Test
    fun `when atempting to add a new currency if everything is ok and it is on the database than it should save a copy of the data with active set to true`() {
        `when`(ratesRepository.findBySymbol("ETH")).thenReturn(ratesStubs.getEthRate())

        val addCurrencyRequest = AddCurrencyRequest(symbol = "ETH", toUsd = "0.823454", fromUsd = "1.214396")

        assertDoesNotThrow {
            rateServiceImpl.add(addCurrencyRequest)
        }
    }

    @Test
    fun `when atempting to add a new currency if the currency already exists in database and is active than a CurrencyAlreadyAddedException be must thrown`() {
        `when`(ratesRepository.findBySymbol("BRL")).thenReturn(ratesStubs.getBrlRate())

        val addCurrencyRequest = AddCurrencyRequest(symbol = "BRL", toUsd = "0.823454", fromUsd = "1.214396")

        assertThrows<CurrencyAlreadyAddedException> { rateServiceImpl.add(addCurrencyRequest) }
    }

    @Test
    fun `when atempting to delete a new currency if everything is ok than it should be removed from database`() {
        `when`(ratesRepository.findBySymbol("BRL")).thenReturn(ratesStubs.getBrlRate())

        assertDoesNotThrow {
            rateServiceImpl.delete("BRL")
        }.also {
            verify(ratesRepository, times(1)).deleteBySymbol("BRL")
        }
    }

    @Test
    fun `when atempting to delete a new currency if the currency already exists in database than a CurrencyAlreadyAddedException be must thrown`() {
        `when`(ratesRepository.findBySymbol("BRL")).thenReturn(null)

        assertThrows<CurrencyNotFoundException> { rateServiceImpl.delete("ETH") }.also {
            verify(ratesRepository, times(0)).deleteBySymbol("BRL")
        }
    }

}