package quoteservice.web.entities.responses

import quoteservice.web.entities.Rates

data class SupplierResponse (
    val success: String,
    val base: String,
    val date: String,
    val rates: Rates
)
