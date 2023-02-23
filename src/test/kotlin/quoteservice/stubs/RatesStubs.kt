package quoteservice.stubs

import quoteservice.repositories.models.Rate

class RatesStubs {
    fun getUsdRate(): Rate {
        return Rate(
            symbol = "USD",
            toUsd = "1",
            fromUsd = "1",
            active = true
        )
    }

    fun getBrlRate(): Rate {
        return Rate(
            symbol = "BRL",
            toUsd = "0.193563",
            fromUsd = "5.166268",
            active = true
        )
    }

    fun getBtcRate(): Rate {
        return Rate(
            symbol = "BTC",
            toUsd = "24788.461757",
            fromUsd = "0.000040",
            active = true
        )
    }

    fun getEthRate(): Rate {
        return Rate(
            symbol = "ETH",
            toUsd = "24788.461757",
            fromUsd = "0.000040",
            active = false
        )
    }

    fun getAudRate(): Rate {
        return Rate(
            symbol = "AUD",
            toUsd = "24788.461757",
            fromUsd = "0.000040",
            active = false
        )
    }

    fun getUpdatedBrlRate(): Rate {
        return Rate(
            symbol = "BRL",
            toUsd = "0.212482",
            fromUsd = "4.706268",
            active = false
        )
    }

    fun getPsnRate(): Rate {
        return Rate(
            symbol = "PSN",
            toUsd = "0.212482",
            fromUsd = "14970.059900",
            active = false
        )
    }
}