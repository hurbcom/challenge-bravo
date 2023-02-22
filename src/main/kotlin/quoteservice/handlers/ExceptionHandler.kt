package quoteservice.handlers

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import quoteservice.exceptions.CurrencyAlreadyAddedException
import quoteservice.exceptions.UnsupportedCurrencyException


@ControllerAdvice
class ExceptionHandler {

    @ExceptionHandler(value = [CurrencyAlreadyAddedException::class])
    fun handleCurrencyAlreadyAddedException(exception: Exception): ResponseEntity<String> {
        return ResponseEntity(exception.message, HttpStatus.UNPROCESSABLE_ENTITY)
    }
    @ExceptionHandler(value = [UnsupportedCurrencyException::class])
    fun handleUnsupportedCurrencyException(exception: Exception): ResponseEntity<String> {
        return ResponseEntity(exception.message, HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler
    fun handle(exception: Exception): ResponseEntity<String> {
        return ResponseEntity(exception.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}