package quoteservice.web.controllers

import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import quoteservice.repositories.ExchangeDataRepository
import quoteservice.web.entities.responses.ConversionResponse
import quoteservice.web.suppliers.RatesSupplier

@Controller
@RequestMapping("/currency")
class CurrencyController (
    @Qualifier("forexSupplier") val forexSupplier: RatesSupplier,
    val repository: ExchangeDataRepository
) {

    @GetMapping("/convert")
    fun convert(
        @RequestParam from: String,
        @RequestParam to: String,
        @RequestParam amount: String
    ): ResponseEntity<ConversionResponse> {
        TODO()
    }

    @PostMapping("/add")
    fun add(): ResponseEntity<String> {
        TODO()
    }
}
