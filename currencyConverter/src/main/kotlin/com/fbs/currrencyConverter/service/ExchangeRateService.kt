package com.fbs.currrencyConverter.service

import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

@Service
class ExchangeRateService(private val restTemplate: RestTemplate) {

    fun fetchRates(): Map<String, Double> {
        val url = "https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=USD,BRL,EUR,BTC,ETH"
        val ratesMap = restTemplate.getForObject(url, HashMap<String, Double>().javaClass)
        return ratesMap
    }
}