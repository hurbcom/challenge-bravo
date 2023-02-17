package quoteservice

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class QuoteServiceApplication

fun main(args: Array<String>) {
	runApplication<QuoteServiceApplication>(*args)
}
