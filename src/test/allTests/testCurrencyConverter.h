#pragma once

#include "gtest/gtest.h"
#include "service/CurrencyConverter.h"
#include "mockCurrencyCache.h"
#include "mockHttpClient.h"

typedef struct {
	CurrencyConversion conversion;
	string expectedValue;
} conversionTest;

class testCurrencyConverter : public testing::WithParamInterface<conversionTest>, public testing::Test {
protected:
	CurrencyConverter converter;
	mockCurrencyCache cache;
	mockHttpClient client;
public:
	static void SetUpTestCase() {};
	static void TearDownTestCase() {};
	testCurrencyConverter();
	virtual ~testCurrencyConverter();

};

