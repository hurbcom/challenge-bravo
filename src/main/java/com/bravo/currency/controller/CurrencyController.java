package com.bravo.currency.controller;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import com.bravo.currency.dto.CurrencyRequestDto;
import com.bravo.currency.dto.CurrencyResponseDto;
import com.bravo.currency.model.Currency;
import com.bravo.currency.service.CurrencyService;
import com.bravo.error.dto.ErrorDto;
import com.bravo.error.exception.CurrencyExistException;
import com.bravo.error.exception.CurrencyNotExistException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class CurrencyController {

  private final CurrencyService currencyService;

  @Autowired
  public CurrencyController(final CurrencyService currencyService) {
    this.currencyService = currencyService;
  }

  @Cacheable(value = "currencyResponse", key = "#currency")
  @GetMapping(value = "/currency/{currency}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity get(@PathVariable final String currency) {

    final Currency currencyData = currencyService.getCurrency(currency);

    if (currencyData == null) {
      log.warn("Currency not found. CURRENCY: {}", currency);
      return ResponseEntity.notFound().build();
    }

    final CurrencyResponseDto currencyResponseDto = CurrencyResponseDto
        .builder()
        .currency(currencyData)
        .build()
        .add(linkTo(methodOn(CurrencyController.class).get(currency)).withSelfRel());

    return ResponseEntity.ok(currencyResponseDto);
  }

  @PostMapping(value = "/currency", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity create(@RequestBody final CurrencyRequestDto currencyDto) {

    if (!StringUtils.hasText(currencyDto.getCode())) {
      log.warn("CODE attribute can not be empty. {} ", currencyDto);
      return ResponseEntity
          .badRequest()
          .body(new ErrorDto("The attribute 'code' can't be Null or Empty"));
    }

    if (currencyDto.getRate() == null || currencyDto.getRate() == 0) {
      log.warn("RATE attribute can not be Null or 0.0. {} ", currencyDto);

      return ResponseEntity
          .badRequest()
          .body(new ErrorDto("The attribute 'rate' can't be Null or 0.0"));
    }

    try {
      final Currency currency = currencyService.create(currencyDto);
      final CurrencyResponseDto currencyResponseDto = CurrencyResponseDto
          .builder()
          .currency(currency)
          .build()
          .add(linkTo(methodOn(CurrencyController.class).get(currency.getCode())).withSelfRel());

      return ResponseEntity
          .status(HttpStatus.CREATED)
          .body(currencyResponseDto);

    } catch (final CurrencyExistException e) {
      log.warn("The currency already exist. CODE: {}", currencyDto.hashCode(), e);
      return ResponseEntity
          .badRequest()
          .body(new ErrorDto("The currency already exists"));
    }
  }

  @PutMapping(value = "/currency/{currency}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity update(@PathVariable final String currency,
      @RequestBody final CurrencyRequestDto currencyDto) {

    if (currencyDto.getRate() == null || currencyDto.getRate() == 0) {
      log.warn("RATE attribute can not be Null or 0.0. {} ", currencyDto);
      return ResponseEntity
          .badRequest()
          .body(new Error("The attribute 'rate' can't be Null or 0.0"));
    }

    currencyDto.setCode(currency);

    try {
      final Currency currencyData = currencyService.update(currencyDto);
      final CurrencyResponseDto currencyResponseDto = CurrencyResponseDto
          .builder()
          .currency(currencyData)
          .build()
          .add(linkTo(methodOn(CurrencyController.class).get(currencyData.getCode())).withSelfRel());

      return ResponseEntity.ok(currencyResponseDto);
    } catch (final CurrencyNotExistException e) {
      log.warn("The currency not exist. CODE: {}", currencyDto.hashCode(), e);
      return ResponseEntity.notFound().build();
    }
  }


  @DeleteMapping("/currency/{currency}")
  public ResponseEntity delete(@PathVariable final String currency) {
    try {
      currencyService.deleteByCurrency(currency);
    } catch (final CurrencyNotExistException e) {
      log.warn("The currency not exist. CODE: {}", currency, e);
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.noContent().build();
  }

}
