package com.hurb.challenge.challengeresolve.service;

import com.hurb.challenge.challengeresolve.model.AwesomeApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
@Service
public class MoneyConvertService {
    @Autowired
    private RedisService redisService;
    @Autowired
    private AwesomeApiService awesomeApiService;
    public BigDecimal convertCurrency(String originCurrency, String finalCurrency, BigDecimal amount){
        String key = originCurrency + "-" + finalCurrency;
        Boolean isInCluster = redisService.checkKey(key);
        if (isInCluster.equals(true)) {
            BigDecimal tax = BigDecimal.valueOf(Float.parseFloat(redisService.getTax(key)));
            return amount.multiply(tax);
        }
        AwesomeApi awesomeApi = awesomeApiService.fetchCurrency(originCurrency, finalCurrency);
        redisService.includeInCluster(awesomeApi);
        return awesomeApi.generateValueKey();
    }

    public void addToCluster(String originCurrency, String finalCurrency, BigDecimal constant) {
        String key = originCurrency + "-" + finalCurrency;
        String reverseKey = finalCurrency + "-" + originCurrency;
        redisService.includeInCluster(key, constant);
        BigDecimal inversedConstant = BigDecimal.valueOf(1 / constant.floatValue());
        redisService.includeInCluster(reverseKey, inversedConstant);
    }

}
