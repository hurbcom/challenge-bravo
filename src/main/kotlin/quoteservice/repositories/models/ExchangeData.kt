package quoteservice.repositories.models

import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field

data class ExchangeData(
    @Field("last_update")
    val lastUpdated: String,
    @Field("rates")
    val rates: List<Rate>
)
