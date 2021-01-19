package com.bravo.currency.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;

import com.bravo.currency.dto.CurrencyRequestDto;
import com.bravo.currency.model.Currency;
import com.bravo.currency.repository.CurrencyRepository;
import com.bravo.error.exception.CurrencyExistException;
import com.bravo.error.exception.CurrencyNotExistException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CurrencyServiceTest {

  @Mock
  private CurrencyRepository currencyRepository;
  @InjectMocks
  private CurrencyService currencyService;

  @Test
  @DisplayName("Test get currency exist")
  void getCurrencyTest() {
    Mockito.when(currencyRepository.findByCode("BRL")).thenReturn(new Currency());
    final Currency result = currencyService.getCurrency("BRL");
    assertNotNull(result);
  }

  @Test
  @DisplayName("Test get currency not exist")
  void containsCurrencyNotExistTest() {
    Mockito.when(currencyRepository.findByCode("BRL")).thenReturn(null);
    final Currency result = currencyService.getCurrency("BRL");
    assertNull(result);
  }


  @Test
  @DisplayName("Test create currency")
  void createCurrencyTest() throws CurrencyExistException {

    final CurrencyRequestDto currencyRequestDto = new CurrencyRequestDto();
    currencyRequestDto.setCode("BRL");
    currencyRequestDto.setRate(1.1);

    final Currency currency = new Currency();
    currency.setCode("BRL");
    currency.setRate(1.1);

    Mockito.when(currencyRepository.save(any())).thenReturn(currency);

    final Currency result = currencyService.create(currencyRequestDto);
    assertNotNull(result);
    assertEquals("BRL", result.getCode());
    assertEquals(1.1, result.getRate());
  }

  @Test
  @DisplayName("Test create currency exist")
  void createCurrencyExistTest() throws CurrencyExistException {

    final CurrencyRequestDto currencyRequestDto = new CurrencyRequestDto();
    currencyRequestDto.setCode("BRL");
    currencyRequestDto.setRate(1.1);

    final Currency currency = new Currency();
    currency.setCode("BRL");
    currency.setRate(1.1);

    Mockito.when(currencyRepository.existsByCode("BRL")).thenReturn(true);

    final CurrencyExistException exception = assertThrows(CurrencyExistException.class, () -> {
      currencyService.create(currencyRequestDto);
    });

    Mockito.verify(currencyRepository, Mockito.times(0)).save(any());
    assertEquals(exception.getCurrency(), "BRL");
    assertEquals(exception.getMessage(), "Current exist: BRL");
  }

  @Test
  @DisplayName("Test update currency")
  void updateCurrencyTest() throws CurrencyNotExistException {

    final CurrencyRequestDto currencyRequestDto = new CurrencyRequestDto();
    currencyRequestDto.setCode("BRL");
    currencyRequestDto.setRate(1.1);

    final Currency currencyDatabase = new Currency();
    currencyDatabase.setId(1l);
    currencyDatabase.setCode("BRL");
    currencyDatabase.setRate(1.0);

    final Currency newCurrencyDatabase = new Currency();
    newCurrencyDatabase.setId(1l);
    newCurrencyDatabase.setCode("BRL");
    newCurrencyDatabase.setRate(1.1);

    Mockito.when(currencyRepository.findByCode("BRL")).thenReturn(currencyDatabase);
    Mockito.when(currencyRepository.save(newCurrencyDatabase)).thenReturn(newCurrencyDatabase);

    final Currency result = currencyService.update(currencyRequestDto);
    assertNotNull(result);
    assertEquals("BRL", result.getCode());
    assertEquals(1.1, result.getRate());
  }

  @Test
  @DisplayName("Test update currency not exist")
  void updateCurrencyNotExistTest() throws CurrencyNotExistException {

    final CurrencyRequestDto currencyRequestDto = new CurrencyRequestDto();
    currencyRequestDto.setCode("BRL");
    currencyRequestDto.setRate(1.1);

    Mockito.when(currencyRepository.findByCode("BRL")).thenReturn(null);

    final CurrencyNotExistException exception = assertThrows(CurrencyNotExistException.class, () -> {
      currencyService.update(currencyRequestDto);
    });

    Mockito.verify(currencyRepository, Mockito.times(0)).save(any());
    assertEquals(exception.getCurrency(), "BRL");
    assertEquals(exception.getMessage(), "Current not exist: BRL");

  }


  @Test
  @DisplayName("Test delete currency")
  void deleteByCurrencyTest() throws CurrencyNotExistException {

    final Currency currencyDatabase = new Currency();
    currencyDatabase.setId(1l);
    currencyDatabase.setCode("BRL");
    currencyDatabase.setRate(1.1);

    Mockito.when(currencyRepository.findByCode("BRL")).thenReturn(currencyDatabase);

    Mockito.doNothing().when(currencyRepository).delete(currencyDatabase);

    currencyService.deleteByCurrency("BRL");
    Mockito.verify(currencyRepository, Mockito.times(1)).delete(currencyDatabase);
  }

  @Test
  @DisplayName("Test delete currency not exist")
  void deleteByCurrencyNotExistTest() {

    final CurrencyNotExistException exception = assertThrows(CurrencyNotExistException.class, () -> {
      currencyService.deleteByCurrency("BRL");
    });

    Mockito.verify(currencyRepository, Mockito.times(0)).delete(any());
    assertEquals(exception.getCurrency(), "BRL");
    assertEquals(exception.getMessage(), "Current not exist: BRL");
  }
}