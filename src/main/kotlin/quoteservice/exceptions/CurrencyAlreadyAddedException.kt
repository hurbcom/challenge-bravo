package quoteservice.exceptions

data class CurrencyAlreadyAddedException (
    override val message: String
): Exception(message)

