package quoteservice

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableScheduling
class QuoteServiceApplication

fun main(args: Array<String>) {
	runApplication<QuoteServiceApplication>(*args)
}
