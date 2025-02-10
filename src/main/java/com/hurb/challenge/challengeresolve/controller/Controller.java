package com.hurb.challenge.challengeresolve.controller;

import com.google.gson.JsonObject;
import com.hurb.challenge.challengeresolve.service.MoneyConvertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("api")
public class Controller {
    @Autowired
    private MoneyConvertService moneyConvertService;

    @GetMapping("/convert")
    public String convertCurrency(
        @RequestParam("from") String originCurrency,
        @RequestParam("to") String finalCurrency,
        @RequestParam("amount") BigDecimal amountMoney
        ){

        BigDecimal value = moneyConvertService.convertCurrency(originCurrency, finalCurrency, amountMoney);
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("from", originCurrency);
        jsonObject.addProperty("to", finalCurrency);
        jsonObject.addProperty("amount", amountMoney);
        jsonObject.addProperty("convertedValue", value);
        return jsonObject.toString();

    }

    @GetMapping("/currency")
    public ResponseEntity addNewCurrency(
        @RequestParam("from") String originCurrency,
        @RequestParam("to") String finalCurrency,
        @RequestParam("conversionTax") BigDecimal constant
    ) {
        moneyConvertService.addToCluster(originCurrency, finalCurrency, constant);
        return new ResponseEntity<>(HttpStatus.valueOf(202).toString(), HttpStatus.ACCEPTED);

    }
}

