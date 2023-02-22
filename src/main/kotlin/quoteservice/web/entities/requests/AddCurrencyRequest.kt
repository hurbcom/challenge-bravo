package quoteservice.web.entities.requests

data class AddCurrencyRequest(
    val symbol: String,
    val fromUsd: String,
    val toUsd: String
)
