#include <mutex>

#include "CurrencyConverter.h"

string CurrencyConverter::getOnlineValue(const string& currency) {
	auto response = _client->get(currency);
	if (!response.body().is_valid() || response.status_code() != 200) {
		return "";
	}

	auto json = response.extract_json().get();
	if (!json.has_field(currency)) {
		return "";
	}

	// Save online value to cache
	string rate = json.at(currency).serialize();
	_cache->saveRate(currency, rate);

	return rate;
}

double CurrencyConverter::getCachedOrOnlineValue(const string& currency) {
	if (currency == "USD") {
		return 1;
	}

	// Try to retrieve a cached value of currency rate
	string rate = _cache->findRate(currency);
	if (rate.empty()) {

		// Retrieve currency rate from web if couldn't find it in cache
		rate = CurrencyConverter::getOnlineValue(currency);
		if (rate.empty()) {
			throw::CurrencyConverterException("Couldn't find currency rate");
		}
	}
	return atof(rate.c_str());
}

double CurrencyConverter::convert(CurrencyConversion& conversionInfo) {
	if (conversionInfo.from() == conversionInfo.to()) {
		return atof(conversionInfo.amount().c_str());
	}

	return atof(conversionInfo.amount().c_str()) / getCachedOrOnlineValue(conversionInfo.from()) *
			getCachedOrOnlineValue(conversionInfo.to());
}
