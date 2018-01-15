#include "CurrencyCache.h"

#include <cstring>
#include <chrono>

string CurrencyCache::findRate(string currency) {
	// Read currency rate from database
	auto futureReply = redis.get(currency);
	redis.commit();

	// Wait Redis client response so we can check reply was ok or not
	auto reply = futureReply.get();
	if (reply.ok() && !reply.is_error() && !reply.is_null()) {
		return reply.as_string();
	}
	return "";
}

void CurrencyCache::saveRate(string currency, string rate) {
	// Save currency rate to database and set TTL (time to live)
	auto future = redis.set_advanced(currency, rate, true, CURRENCY_RATE_TTL);
	redis.commit();
}
