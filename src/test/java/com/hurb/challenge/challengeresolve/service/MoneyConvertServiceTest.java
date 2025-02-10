package com.hurb.challenge.challengeresolve.service;

import com.hurb.challenge.challengeresolve.model.AwesomeApi;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MoneyConvertServiceTest {
    @Mock
    private RedisService mockRedisService;
    @Mock
    private AwesomeApiService mockAwesomeApiService;
    @InjectMocks
    private MoneyConvertService underTest = new MoneyConvertService();


    @Test
    void testConversionCurrencyWhenTwoCurrencyAreGivenOkAndIsInCluster() {
        when(mockRedisService.checkKey(anyString())).thenReturn(true);
        when(mockRedisService.getTax(anyString())).thenReturn("5.00");
        BigDecimal testValue = BigDecimal.valueOf(500);
        BigDecimal result = underTest.convertCurrency("BRL", "USD", testValue);
        Assertions.assertEquals(result.floatValue(), 2500F);
    }

    @Test
    void testConversionCurrencyWhenTwoCurrencyAreGivenOkAndNotInCluster() {
        AwesomeApi awesomeApi = generateAwesomeApiForTest();
        when(mockRedisService.checkKey(anyString())).thenReturn(false);
        when(mockAwesomeApiService.fetchCurrency(anyString(), anyString())).thenReturn(awesomeApi);
        BigDecimal testValue = BigDecimal.valueOf(500);
        BigDecimal result = underTest.convertCurrency("BRL","USD",testValue);
        Assertions.assertEquals(result.floatValue(), 30F);
    }

    @Test
    void testAddToCluster() {
        AwesomeApi awesomeApi = generateAwesomeApiForTest();
        underTest.addToCluster(anyString(), anyString(), BigDecimal.valueOf(5));

    }

    private AwesomeApi generateAwesomeApiForTest() {
        AwesomeApi awesomeApi = new AwesomeApi();
        awesomeApi.setHigh(BigDecimal.valueOf(50));
        awesomeApi.setLow(BigDecimal.valueOf(10));
        return awesomeApi;
    }




}