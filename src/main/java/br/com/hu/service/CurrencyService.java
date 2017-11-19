package br.com.hu.service;

import java.util.Arrays;
import java.util.List;

import javax.money.CurrencyUnit;
import javax.money.Monetary;
import javax.money.MonetaryAmount;
import javax.money.convert.CurrencyConversion;
import javax.money.convert.ExchangeRateProvider;
import javax.money.convert.MonetaryConversions;

import org.javamoney.moneta.Money;
import org.springframework.stereotype.Service;

@Service
public class CurrencyService {

	public Double conversion(String to, String from, String amount) throws Exception {
		Double amountDouble = Double.parseDouble(amount);
		if (valFormat(to, from)) {
			return applyConversion(to, from, amountDouble);
		} else {
			throw new Exception("Invalid currency");
		}

	}

	private boolean valFormat(String to, String from) {
		List<String> currencies = Arrays.asList("USD", "BRL", "EUR", "BTC", "ETH");
		if (currencies.contains(to))
			return currencies.contains(from);
		return false;
	}

	private Double applyConversion(String to, String from, Double amount) {
		ExchangeRateProvider ecbRateProvider = MonetaryConversions.getExchangeRateProvider("ECB");
		CurrencyUnit toCurrency = Monetary.getCurrency(to);
		CurrencyUnit fromCurrency = Monetary.getCurrency(from);

		CurrencyConversion ecbConvertion = ecbRateProvider.getCurrencyConversion(fromCurrency);

		MonetaryAmount money = Money.of(amount, toCurrency);
		return money.with(ecbConvertion).getNumber().doubleValue();
	}

}
