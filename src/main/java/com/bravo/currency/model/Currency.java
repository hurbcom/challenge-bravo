package com.bravo.currency.model;

import com.bravo.currency.dto.CurrencyRequestDto;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Entity
@Table(name = "currency")
public class Currency {

  @Id
  @GeneratedValue
  @Column(name = "id")
  private Long id;
  @Column(name = "code", unique = true, nullable = false)
  private String code;
  @Column(name = "rate", nullable = false)
  private Double rate;

  @Builder(builderMethodName = "builder")
  public static Currency newInstance(final CurrencyRequestDto currencyRequestDto) {
    return new Currency(null, currencyRequestDto.getCode(), currencyRequestDto.getRate());
  }

}
