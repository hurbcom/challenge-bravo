package com.bravo.error.exception;

import lombok.Getter;

@Getter
public class CurrencyExistException extends Exception {

  private final String currency;

  public CurrencyExistException(final String currency) {
    super("Current exist: " + currency);
    this.currency = currency;
  }
}
