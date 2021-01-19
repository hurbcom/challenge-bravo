package com.bravo.exchange.dto;

import lombok.Builder;
import lombok.Getter;
import org.springframework.hateoas.RepresentationModel;

@Getter
@Builder
public class ExchangeResponseDto extends RepresentationModel<ExchangeResponseDto> {

  private final String currency = "USD";
  private final Double amount;

}
