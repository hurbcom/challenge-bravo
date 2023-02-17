package quoteservice.repositories

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import quoteservice.repositories.models.ExchangeData

@Repository
interface ExchangeDataRepository: MongoRepository<ExchangeData, String> {
}