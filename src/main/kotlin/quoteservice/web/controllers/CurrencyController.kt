package quoteservice.web.controllers

import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import quoteservice.loggers.Logger
import quoteservice.web.entities.requests.AddCurrencyRequest
import quoteservice.web.entities.responses.ConversionResponse
import quoteservice.web.services.RateService
import quoteservice.web.suppliers.RatesSupplier

@Controller
@RequestMapping("/currency")
class CurrencyController (
    @Qualifier("forexSupplier") val forexSupplier: RatesSupplier,
    val rateService: RateService
) {

    @GetMapping("/convert")
    fun convert(
        @RequestParam from: String,
        @RequestParam to: String,
        @RequestParam amount: String
    ): ResponseEntity<ConversionResponse> {
        val result = rateService.convert(baseCurrencySymbol = from, targetCurrencySymbol = to, amount = amount)
        return ResponseEntity.ok(result)
    }

    @PostMapping("/add")
    fun add(@RequestBody request: AddCurrencyRequest): ResponseEntity<String> {
        rateService.add(request)
        return ResponseEntity(HttpStatus.NO_CONTENT)
    }

    @DeleteMapping("/delete")
    fun delete(@RequestParam currency: String): ResponseEntity<String> {
        rateService.delete(currency)
        return ResponseEntity(HttpStatus.NO_CONTENT)
    }
}
