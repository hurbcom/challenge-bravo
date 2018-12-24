package com.fbs.currrencyConverter.controller

import org.hamcrest.CoreMatchers
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.ArgumentMatchers
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.web.client.RestTemplate

@RunWith(SpringRunner::class)
@SpringBootTest
@AutoConfigureMockMvc
class ConverterControllerTest {

    @Autowired private lateinit var mvc: MockMvc
    @MockBean private lateinit var restTemplateMock: RestTemplate

    @Test
    fun get_a_conversion_value() {
        val rates = hashMapOf<String, Double>("BRL" to 2.0, "USD" to 1.0)
        val url = "https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=USD,BRL,EUR,BTC,ETH"
        val from = "BRL"
        val to = "USD"
        val amount = "20"
        val result = "10"

        Mockito.`when`(restTemplateMock.getForObject(Mockito.eq(url), ArgumentMatchers.any(Class::class.java)))
                .thenReturn(rates)

        mvc.perform(MockMvcRequestBuilders.get("/currencyConverter/?from=$from&to=$to&amount=$amount"))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.from", CoreMatchers.`is`(from)))
                .andExpect(MockMvcResultMatchers.jsonPath("$.to", CoreMatchers.`is`(to)))
                .andExpect(MockMvcResultMatchers.jsonPath("$.amount", CoreMatchers.`is`(amount.toDouble())))
                .andExpect(MockMvcResultMatchers.jsonPath("$.result", CoreMatchers.`is`(result.toDouble())))
    }

    @Test
    fun get_a_conversion_value_with_currency_uppercase_or_not() {
        val rates = hashMapOf<String, Double>("BRL" to 2.0, "USD" to 1.0)
        val url = "https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=USD,BRL,EUR,BTC,ETH"
        val from = "bRl"
        val to = "UsD"
        val amount = "20"
        val result = "10"

        Mockito.`when`(restTemplateMock.getForObject(Mockito.eq(url), ArgumentMatchers.any(Class::class.java)))
                .thenReturn(rates)

        mvc.perform(MockMvcRequestBuilders.get("/currencyConverter/?from=$from&to=$to&amount=$amount"))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.from", CoreMatchers.`is`(from)))
                .andExpect(MockMvcResultMatchers.jsonPath("$.to", CoreMatchers.`is`(to)))
                .andExpect(MockMvcResultMatchers.jsonPath("$.amount", CoreMatchers.`is`(amount.toDouble())))
                .andExpect(MockMvcResultMatchers.jsonPath("$.result", CoreMatchers.`is`(result.toDouble())))
    }

    @Test
    fun get_a_conversion_with_invalid_currency_from() {
        val rates = hashMapOf<String, Double>("BRL" to 2.0, "USD" to 1.0)
        val url = "https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=USD,BRL,EUR,BTC,ETH"
        val from = "XXX"
        val to = "USD"
        val amount = "20"

        Mockito.`when`(restTemplateMock.getForObject(Mockito.eq(url), ArgumentMatchers.any(Class::class.java)))
                .thenReturn(rates)

        mvc.perform(MockMvcRequestBuilders.get("/currencyConverter/?from=$from&to=$to&amount=$amount"))
                .andExpect(MockMvcResultMatchers.status().isBadRequest)
    }

    @Test
    fun get_a_conversion_with_invalid_currency_to() {
        val rates = hashMapOf<String, Double>("BRL" to 2.0, "USD" to 1.0)
        val url = "https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=USD,BRL,EUR,BTC,ETH"
        val from = "BRL"
        val to = "XXX"
        val amount = "20"

        Mockito.`when`(restTemplateMock.getForObject(Mockito.eq(url), ArgumentMatchers.any(Class::class.java)))
                .thenReturn(rates)

        mvc.perform(MockMvcRequestBuilders.get("/currencyConverter/?from=$from&to=$to&amount=$amount"))
                .andExpect(MockMvcResultMatchers.status().isBadRequest)
    }

    @Test
    fun get_a_conversion_with_invalid_currency_amount() {
        val rates = hashMapOf<String, Double>("BRL" to 2.0, "USD" to 1.0)
        val url = "https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=USD,BRL,EUR,BTC,ETH"
        val from = "BRL"
        val to = "USD"
        val amount = "XXX"

        Mockito.`when`(restTemplateMock.getForObject(Mockito.eq(url), ArgumentMatchers.any(Class::class.java)))
                .thenReturn(rates)

        mvc.perform(MockMvcRequestBuilders.get("/currencyConverter/?from=$from&to=$to&amount=$amount"))
                .andExpect(MockMvcResultMatchers.status().isBadRequest)
    }
}