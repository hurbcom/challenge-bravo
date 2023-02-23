package quoteservice.exceptions

data class CurrencyAlreadyInactiveException (
    override val message: String
): Exception(message)