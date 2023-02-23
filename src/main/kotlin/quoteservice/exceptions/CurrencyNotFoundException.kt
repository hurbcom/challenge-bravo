package quoteservice.exceptions

data class CurrencyNotFoundException (
    override val message: String
): Exception(message)