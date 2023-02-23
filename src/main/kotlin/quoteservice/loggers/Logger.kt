package quoteservice.loggers

import mu.KLogger
import mu.KotlinLogging.logger
import org.springframework.stereotype.Component

@Component
class Logger (
    val kLogger: KLogger = logger {}
)