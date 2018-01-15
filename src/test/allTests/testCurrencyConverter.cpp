#include "testCurrencyConverter.h"
#include "gmock/gmock.h"
#include "mockHttpClient.h"
#include "cpprest/json.h"

using ::testing::Return;
using namespace web;

testCurrencyConverter::testCurrencyConverter() {
	converter.setCache(cache);
	converter.setClient(client);
}

testCurrencyConverter::~testCurrencyConverter() {
}

TEST_P(testCurrencyConverter, ConvertFromCacheAndOnline) {
	auto params = GetParam();
	string rate;

	// Mocked Cache values
	map<string, string> cachedCurrencyRates;
	cachedCurrencyRates["USD"] = "1";
	cachedCurrencyRates["BRL"] = "3.43";
	cachedCurrencyRates["EUR"] = "0.8991";
	cachedCurrencyRates["BTC"] = "";
	cachedCurrencyRates["ETH"] = "";

	// Mocked Online values
	map<string, string> onlineCurrencyRates;
	onlineCurrencyRates["USD"] = "1";
	onlineCurrencyRates["BRL"] = "3.41";
	onlineCurrencyRates["EUR"] = "0.9121";
	onlineCurrencyRates["BTC"] = "0.00005455";
	onlineCurrencyRates["ETH"] = "0.0009888";

	string fromRate = !cachedCurrencyRates.at(params.conversion.from()).empty() ?
			cachedCurrencyRates.at(params.conversion.from()) :
			onlineCurrencyRates.at(params.conversion.from());

	string toRate = !cachedCurrencyRates.at(params.conversion.to()).empty() ?
			cachedCurrencyRates.at(params.conversion.to()) :
			onlineCurrencyRates.at(params.conversion.to());

	double expected =
			atof(params.conversion.amount().c_str()) /
			atof(fromRate.c_str()) *
			atof(toRate.c_str());

	http_response responseFrom(200);
	json::value bodyFrom;
	bodyFrom[params.conversion.from()] = json::value(atof(onlineCurrencyRates.at(params.conversion.from()).c_str()));
	responseFrom.set_body(bodyFrom);
	ON_CALL(client,get(params.conversion.from())).WillByDefault(Return(responseFrom));

	http_response responseTo(200);
	json::value bodyTo;
	bodyTo[params.conversion.to()] = json::value(atof(onlineCurrencyRates.at(params.conversion.to()).c_str()));
	responseTo.set_body(bodyTo);
	ON_CALL(client,get(params.conversion.to())).WillByDefault(Return(responseTo));

	ON_CALL(cache,findRate(params.conversion.from())).WillByDefault(Return(cachedCurrencyRates.at(params.conversion.from())));
	ON_CALL(cache,findRate(params.conversion.to())).WillByDefault(Return(cachedCurrencyRates.at(params.conversion.to())));

	double value = converter.convert(params.conversion);

	EXPECT_DOUBLE_EQ(expected, value);
}

INSTANTIATE_TEST_CASE_P(Default, testCurrencyConverter, testing::Values(
	conversionTest{CurrencyConversion("BRL", "USD", "9.99")},
	conversionTest{CurrencyConversion("USD", "USD", "9.99")},
	conversionTest{CurrencyConversion("USD", "BRL", "9.99")},
	conversionTest{CurrencyConversion("BRL", "BTC", "9.99")},
	conversionTest{CurrencyConversion("BTC", "ETH", "9.99")}
));

