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
	
	public double conversion(String to, String from, Double value) throws Exception {
		if(valFormat(to, from)) {
			return applyConversion(to, from, value);
		}else {
			throw new Exception("invalid currency");
		}
			
	}
	
	private boolean valFormat(String to, String from) {
		List<String> currencies = Arrays.asList("sup1", "sup2", "sup3");
		if(currencies.contains(to))
			return currencies.contains(from);
		return false;
	}
	
	
	private double applyConversion(String to, String from, Double value) {
		ExchangeRateProvider ecbRateProvider = MonetaryConversions.getExchangeRateProvider("ECB");
		CurrencyUnit toCurrency = Monetary.getCurrency(to);
		CurrencyUnit fromCurrency = Monetary.getCurrency(from);
		
		CurrencyConversion ecbConvertion = ecbRateProvider.getCurrencyConversion(fromCurrency);
		
		MonetaryAmount money = Money.of(value, toCurrency);
		return money.with(ecbConvertion).getNumber().doubleValue();
	}
	
}
