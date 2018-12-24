package com.fbs.currrencyConverter.service

import org.hamcrest.CoreMatchers
import org.hamcrest.MatcherAssert
import org.junit.Before
import org.junit.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.Mockito.times
import org.mockito.MockitoAnnotations

class ConverterServiceUnitTest {

    @InjectMocks
    private lateinit var converterService: ConverterService
    @Mock
    private lateinit var exchangeRateService: ExchangeRateService

    @Before
    fun setup() = MockitoAnnotations.initMocks(this)

    @Test
    fun converter_service_should_calculate_correct_conversion() {
        Mockito.`when`(exchangeRateService.fetchRates()).thenReturn(hashMapOf("BRL" to 2.0, "USD" to 1.0))

        val resultConverter = converterService.converts("BRL", "USD", 20.0)

        MatcherAssert.assertThat(resultConverter.from, CoreMatchers.`is`("BRL"))
        MatcherAssert.assertThat(resultConverter.to, CoreMatchers.`is`("USD"))
        MatcherAssert.assertThat(resultConverter.amount, CoreMatchers.`is`(20.0))
        MatcherAssert.assertThat(resultConverter.result, CoreMatchers.`is`(10.0))

        Mockito.verify(exchangeRateService, times(1)).fetchRates()
    }

    @Test
    fun fetchRates_should_be_called_one_time_until_cache_expiration() {
        Mockito.`when`(exchangeRateService.fetchRates()).thenReturn(hashMapOf("BRL" to 2.0, "USD" to 1.0))

        converterService.converts("BRL", "USD", 20.0)
        converterService.converts("USD", "BRL", 20.0)
        converterService.converts("BRL", "BRL", 20.0)
        converterService.converts("USD", "USD", 20.0)

        Mockito.verify(exchangeRateService, times(1)).fetchRates()
    }
}