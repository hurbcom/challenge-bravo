package quoteservice.jobs

import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import quoteservice.processors.RatesProcessor

@Component
class UpdateRatesJob(
    val ratesProcessor: RatesProcessor,
) {
    @Scheduled(fixedDelay = 60000)
    fun process() {
        runCatching {
            ratesProcessor.updateRates()
        }.getOrElse {
            println("Failure updating exchange rates")
        }
    }
}