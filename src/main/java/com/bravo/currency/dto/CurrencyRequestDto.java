package com.bravo.currency.dto;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@EqualsAndHashCode
@ToString
public class CurrencyRequestDto {

  private String code;
  private Double rate;
}
