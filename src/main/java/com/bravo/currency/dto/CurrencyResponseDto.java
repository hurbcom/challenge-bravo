package com.bravo.currency.dto;

import com.bravo.currency.model.Currency;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.springframework.hateoas.RepresentationModel;

@Getter
@EqualsAndHashCode(callSuper = false)
public class CurrencyResponseDto extends RepresentationModel<CurrencyResponseDto> {

  private final String code;
  private final Double rate;

  @Builder(builderMethodName = "builder")
  public static CurrencyResponseDto newInstance(final Currency currency) {
    return new CurrencyResponseDto(currency);
  }

  private CurrencyResponseDto(final Currency currency) {
    this.code = currency.getCode();
    this.rate = currency.getRate();
  }


}
