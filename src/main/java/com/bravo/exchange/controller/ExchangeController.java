package com.bravo.exchange.controller;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import com.bravo.error.dto.ErrorDto;
import com.bravo.error.exception.CurrencyNotExistException;
import com.bravo.exchange.dto.ExchangeResponseDto;
import com.bravo.exchange.service.ExchangeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class ExchangeController {

  private final ExchangeService exchangeService;

  @Autowired
  public ExchangeController(final ExchangeService exchangeService) {
    this.exchangeService = exchangeService;
  }

  @GetMapping(value = "/exchange", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity get(@RequestParam(value = "from") final String from,
      @RequestParam(value = "amount") final Double amount) {

    if (!StringUtils.hasText(from)) {
      log.warn("'FROM' parameter is blank. FROM: {} AMOUNT: {} ", from, amount);
      return ResponseEntity
          .status(HttpStatus.BAD_REQUEST)
          .body(new ErrorDto("Invalid 'FROM' parameter"));
    }

    if (amount == null || amount == 0) {
      log.warn("'The 'AMOUNT' must be > 0.00. FROM: {} AMOUNT: {} ", from, amount);
      return ResponseEntity
          .status(HttpStatus.BAD_REQUEST)
          .body(new ErrorDto("The 'AMOUNT' must be > 0.00"));
    }

    try {
      final Double exchange = exchangeService.exchange(from, amount);

      final ExchangeResponseDto exchangeResponse = ExchangeResponseDto
          .builder()
          .amount(exchange)
          .build()
          .add(linkTo(methodOn(ExchangeController.class).get(from, amount)).withSelfRel());

      return ResponseEntity.ok(exchangeResponse);

    } catch (final CurrencyNotExistException e) {
      log.warn("This currency in 'FROM' parameter not exist. FROM: {} AMOUNT: {} ", from, amount);
      return ResponseEntity
          .status(HttpStatus.BAD_REQUEST)
          .body(new ErrorDto("This currency in 'FROM' parameter not exist"));
    }
  }
}
