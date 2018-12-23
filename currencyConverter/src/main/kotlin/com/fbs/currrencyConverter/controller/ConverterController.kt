package com.fbs.currrencyConverter.controller

import com.fbs.currrencyConverter.model.ResultConverter
import com.fbs.currrencyConverter.service.ConverterService
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/currencyConverter")
class ConverterController(private val converterService: ConverterService) {

    @GetMapping(produces = arrayOf(MediaType.APPLICATION_JSON_VALUE))
    fun converter(@RequestParam from: String, to: String, amount: Double): ResponseEntity<ResultConverter> {
        if (!converterService.validParameters(from, to, amount)) {
            return ResponseEntity.badRequest().build()
        }
        val result = converterService.converts(from, to, amount)
        return ResponseEntity.ok(result)
    }
}