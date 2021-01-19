package com.bravo.exchange.service;

import com.bravo.currency.model.Currency;
import com.bravo.currency.service.CurrencyService;
import com.bravo.error.exception.CurrencyNotExistException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExchangeService {

  private final CurrencyService currencyService;

  @Autowired
  public ExchangeService(final CurrencyService currencyService) {
    this.currencyService = currencyService;
  }

  public Double exchange(final String currency, final Double amount)
      throws CurrencyNotExistException {

    final Currency currencyData = currencyService.getCurrency(currency);

    if (currencyData == null) {
      throw new CurrencyNotExistException(currency);
    }

    return currencyData.getRate() * amount;
  }

}
