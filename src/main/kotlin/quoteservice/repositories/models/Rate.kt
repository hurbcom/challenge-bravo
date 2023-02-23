package quoteservice.repositories.models

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field
import java.util.UUID

@Document(collection = "rates")
data class Rate (
    @Id
    val id: String = UUID.randomUUID().toString(),
    @Field
    @Indexed(unique = true)
    val symbol: String,
    val toUsd: String,
    val fromUsd: String,
    val active: Boolean = false
)
