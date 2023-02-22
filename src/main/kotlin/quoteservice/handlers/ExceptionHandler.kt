package quoteservice.handlers

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler


@ControllerAdvice
class ExceptionHandler {
    @ExceptionHandler
    fun handle(exception: Exception): ResponseEntity<String> {
        return ResponseEntity.ok(exception.message)
    }
}