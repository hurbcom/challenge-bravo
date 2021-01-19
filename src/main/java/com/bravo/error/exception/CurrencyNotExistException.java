package com.bravo.error.exception;

import lombok.Getter;

@Getter
public class CurrencyNotExistException extends Exception {

  private final String currency;

  public CurrencyNotExistException(final String currency) {
    super("Current not exist: " + currency);
    this.currency = currency;
  }
}
