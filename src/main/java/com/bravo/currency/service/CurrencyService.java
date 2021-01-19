package com.bravo.currency.service;

import com.bravo.currency.dto.CurrencyRequestDto;
import com.bravo.currency.model.Currency;
import com.bravo.currency.repository.CurrencyRepository;
import com.bravo.error.exception.CurrencyExistException;
import com.bravo.error.exception.CurrencyNotExistException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class CurrencyService {

  private final CurrencyRepository currencyRepository;

  @Autowired
  public CurrencyService(final CurrencyRepository currencyRepository) {
    this.currencyRepository = currencyRepository;
  }

  @Cacheable(value = "currency", key = "#currency")
  public Currency getCurrency(final String currency) {
    return currencyRepository.findByCode(currency.toUpperCase());
  }

  @CacheEvict(cacheNames = {"currencyResponse", "currency"}, key = "#currency")
  public void deleteByCurrency(final String currency) throws CurrencyNotExistException {

    final Currency currencyData = currencyRepository.findByCode(currency);

    if (currencyData == null) {
      throw new CurrencyNotExistException(currency);
    }
    currencyRepository.delete(currencyData);
  }

  @CacheEvict(cacheNames = {"currencyResponse", "currency"}, key = "#currencyDto.code")
  public Currency create(final CurrencyRequestDto currencyDto) throws CurrencyExistException {

    if (currencyRepository.existsByCode(currencyDto.getCode())) {
      throw new CurrencyExistException(currencyDto.getCode());
    }

    return currencyRepository.save(Currency.newInstance(currencyDto));
  }

  @CacheEvict(cacheNames = {"currencyResponse", "currency"}, key = "#currencyDto.code")
  public Currency update(final CurrencyRequestDto currencyDto) throws CurrencyNotExistException {

    final Currency currency = currencyRepository.findByCode(currencyDto.getCode());

    if (currency == null) {
      throw new CurrencyNotExistException(currencyDto.getCode());
    }

    currency.setRate(currencyDto.getRate());
    return currencyRepository.save(currency);
  }
}
