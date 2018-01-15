#pragma once

#include <algorithm>
#include <stdexcept>

using namespace std;

class CurrencyConversion {
private:
	const string _fromCurrency;
	const string _toCurrency;
	const string _amount;

public:
	CurrencyConversion(string fromCurrency, string toCurrency, string amount) :
		_fromCurrency(fromCurrency),
		_toCurrency(toCurrency),
		_amount(amount) {};

	const string from() { return _fromCurrency;};
	const string to() { return _toCurrency;};
	const string amount() { return _amount;};

};
