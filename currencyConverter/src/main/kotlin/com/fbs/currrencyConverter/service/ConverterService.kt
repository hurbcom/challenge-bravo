package com.fbs.currrencyConverter.service

import com.fbs.currrencyConverter.model.ResultConverter
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

@Service
class ConverterService(private val exchangeRateService: ExchangeRateService){

    var rates: HashMap<String, Double> = hashMapOf<String, Double>()
    var expiration = LocalDateTime.now()

    fun converts(from: String, to: String, amount: Double): ResultConverter {

        if (rates.isEmpty() || expiration < LocalDateTime.now().minusSeconds(60)) {
            rates = exchangeRateService.fetchRates() as HashMap<String, Double>
            expiration = LocalDateTime.now()
        }

        var rateFrom = rates.get(from.toUpperCase())
        var rateTo = rates.get(to.toUpperCase())
        var result = 0.0

        if (rateFrom != null && rateTo != null) {
            result = (rateTo * amount) / rateFrom
        }

        return ResultConverter(from, to, amount, result)
    }

    fun validParameters(from: String, to: String, amount: Double): Boolean {
        val currencies = arrayListOf<String>("USD", "BRL", "EUR", "BTC", "ETH")

        if(!currencies.contains(from.toUpperCase())) return false
        if(!currencies.contains(to.toUpperCase())) return false
        if(amount.isNaN()) return false

        return true
    }
}