#pragma once

#include <string>
#include <stdexcept>

#include "../model/CurrencyConversion.h"
#include "../database/CurrencyCache.h"
#include "HttpClient.h"

class CurrencyConverterException : exception {
private:
	string _message;
public:
	CurrencyConverterException(string message) : _message(message) {};
	const char* what() const noexcept {return _message.c_str();}
};

class CurrencyConverter {
private:
	string getOnlineValue(const string& currency);

	CurrencyCache* _cache = nullptr;
	HttpClient* _client = nullptr;

public:
	double getCachedOrOnlineValue(const string& currency);
	void setClient(HttpClient& client) {
		_client = &client;
	}
	void setCache(CurrencyCache& cache) {

		_cache = &cache;
	}
	double convert(CurrencyConversion& convertionInfo);
	CurrencyConverter() {
		_cache = &CurrencyCache::Instance();
		_client = new HttpClient("https://min-api.cryptocompare.com");
	}
};
