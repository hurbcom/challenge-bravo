package com.bravo.exchange.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.bravo.currency.model.Currency;
import com.bravo.currency.service.CurrencyService;
import com.bravo.error.exception.CurrencyNotExistException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ExchangeServiceTest {

  @Mock
  private CurrencyService currencyService;
  @InjectMocks
  private ExchangeService exchangeService;

  @Test
  void exchangeTest() throws CurrencyNotExistException {
    final Currency currency = new Currency();
    currency.setId(1l);
    currency.setRate(1.0);

    Mockito.when(currencyService.getCurrency("BRL")).thenReturn(currency);
    final double result = exchangeService.exchange("BRL", 1.1);
    assertEquals(1.1, result);
  }

  @Test()
  void exchangeCurrentNotExistTest() throws CurrencyNotExistException {
    Mockito.when(currencyService.getCurrency("BRL")).thenReturn(null);
    final CurrencyNotExistException exception = assertThrows(CurrencyNotExistException.class, () -> {
      exchangeService.exchange("BRL", 1.1);
    });
    assertEquals(exception.getCurrency(), "BRL");
    assertEquals(exception.getMessage(), "Current not exist: BRL");
  }

}