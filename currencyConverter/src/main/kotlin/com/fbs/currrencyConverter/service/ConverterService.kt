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

        if (rates.isEmpty() || expiration < LocalDateTime.now().minusSeconds(30)) {
            rates = exchangeRateService.fetchRates() as HashMap<String, Double>
            expiration = LocalDateTime.now()
        }

        var rateFrom = rates.get(from)
        var rateTo = rates.get(to)
        var result = 0.0

        if (rateFrom != null && rateTo != null) {
            result = (rateTo * amount) / rateFrom
        }

        return ResultConverter(from, to, amount, result)
    }

    fun validParameters(from: String, to: String, amount: Double): Boolean {
        return true
    }
}