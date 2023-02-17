package quoteservice.repositories.models

data class Rate (
    val symbol: String,
    val toUsd: String,
    val fromUsd: String,
    val lastUpdate: String
)
