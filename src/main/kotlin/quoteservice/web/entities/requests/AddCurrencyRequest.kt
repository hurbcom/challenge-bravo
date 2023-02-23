package quoteservice.web.entities.requests

import com.fasterxml.jackson.annotation.JsonProperty

data class AddCurrencyRequest(
    @JsonProperty("symbol")
    val symbol: String,
    @JsonProperty("from_usd")
    val fromUsd: String,
    @JsonProperty("to_usd")
    val toUsd: String
)
