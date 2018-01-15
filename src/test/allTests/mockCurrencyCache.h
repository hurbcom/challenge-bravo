#pragma once

#include "gmock/gmock.h"
#include "database/CurrencyCache.h"

class mockCurrencyCache : public CurrencyCache {
public:
	MOCK_METHOD1(findRate, string(string));
	MOCK_METHOD2(saveRate, void(string, string));
	virtual ~mockCurrencyCache() {};
};
