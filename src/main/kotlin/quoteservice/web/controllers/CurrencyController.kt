package quoteservice.web.controllers

import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
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
    fun add(request: AddCurrencyRequest): ResponseEntity<String> {
        rateService.add(request)
        return ResponseEntity(HttpStatus.NO_CONTENT)
    }
}
