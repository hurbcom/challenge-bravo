#pragma once

#include "../model/CurrencyConversion.h"
#include <cpp_redis/cpp_redis>

using namespace std;
using namespace cpp_redis;

class CurrencyCache {
public:
	virtual string findRate(string currency);
	virtual void saveRate(string currency, string rate);

	static CurrencyCache& Instance() {
		// Since it's a static variable, if the class has already been created,
		// it won't be created again.
		// And it **is** thread-safe in C++11.
		static CurrencyCache myInstance;

		// Return a reference to our instance.
		return myInstance;
	}

	// delete copy and move constructors and assign operators
	CurrencyCache(CurrencyCache const&) = delete;             // Copy construct
	CurrencyCache(CurrencyCache&&) = delete;                  // Move construct
	CurrencyCache& operator=(CurrencyCache const&) = delete;  // Copy assign
	CurrencyCache& operator=(CurrencyCache &&) = delete;      // Move assign
	virtual ~CurrencyCache() {
		// Shutdown database client
		redis.disconnect();
	}

private:
	cpp_redis::client redis;
	const static int CURRENCY_RATE_TTL{60*10}; // 10 minutes (in seconds)

protected:
	CurrencyCache() {
		// Initiate database client
		redis.connect("redis", 6379);
	}

};
