package quoteservice.exceptions

import java.lang.Exception

data class UnsupportedCurrencyException (
    override val message: String
): Exception(message)
