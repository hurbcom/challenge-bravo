package quoteservice.repositories

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import quoteservice.repositories.models.Rate

@Repository
interface RatesRepository: MongoRepository<Rate, String> {
    fun findBySymbol(symbol: String): Rate?
    fun deleteBySymbol(symbol: String)
}