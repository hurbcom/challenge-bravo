package quoteservice.exceptions

data class SupplierException (
    override val message: String
): Exception(message)
