package quoteservice.web.suppliers

import quoteservice.repositories.models.Rate

interface RatesSupplier {
    fun getRates(): List<Rate>
}