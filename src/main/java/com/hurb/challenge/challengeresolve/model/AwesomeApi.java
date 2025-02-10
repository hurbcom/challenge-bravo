package com.hurb.challenge.challengeresolve.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.math.BigDecimal;
import java.math.MathContext;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AwesomeApi {
    private String code;
    private String codein;
    private BigDecimal high;
    private BigDecimal low;

    public String generateKey() {
        return getCode() + "-" + getCodein();
    }

    public String generateInvertedKey() {
        return getCodein() + "-" + getCode();
    }

    public BigDecimal generateValueKey() {
        return getHigh().add(getLow()).multiply(BigDecimal.valueOf(0.5));
    }

    public BigDecimal generateValueInvertedKey() {
        return BigDecimal.ONE.divide(generateValueKey(), MathContext.DECIMAL64);
    }
}
