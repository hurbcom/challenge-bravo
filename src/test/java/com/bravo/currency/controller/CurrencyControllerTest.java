package com.bravo.currency.controller;

import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.bravo.currency.dto.CurrencyRequestDto;
import com.bravo.currency.model.Currency;
import com.bravo.currency.service.CurrencyService;
import com.bravo.error.exception.CurrencyExistException;
import com.bravo.error.exception.CurrencyNotExistException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;


@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
class CurrencyControllerTest {

  @MockBean
  private CurrencyService currencyService;
  @Autowired
  private MockMvc mvc;

  @Test
  @DisplayName("Test get currency")
  void getCurrentTest() throws Exception {

    final Currency currency = new Currency();
    currency.setRate(1.1);
    currency.setCode("BRL");

    given(currencyService.getCurrency("BRL"))
        .willReturn(currency);

    mvc.perform(get("/currency/{currency}", "BRL"))
        .andExpect(status().is(200))
        .andExpect(content()
            .json("{\"code\":\"BRL\",\"rate\":1.1,\"_links\":{\"self\":{\"href\":\"http://localhost/currency/BRL\"}}}"));
  }

  @Test
  @DisplayName("Test get currency not found")
  void getCurrentNotFoundTest() throws Exception {

    given(currencyService.getCurrency("BRL"))
        .willReturn(null);

    mvc.perform(get("/currency/{currency}", "BRL"))
        .andExpect(status().is(404));
  }


  @Test
  @DisplayName("Test create currency")
  void createCurrentTest() throws Exception {

    final CurrencyRequestDto currencyDto = new CurrencyRequestDto();
    currencyDto.setRate(1.1);
    currencyDto.setCode("BRL");

    final Currency currency = new Currency();
    currency.setRate(1.1);
    currency.setCode("BRL");

    given(currencyService.create(currencyDto))
        .willReturn(currency);

    mvc.perform(post("/currency")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{ \"code\":\"BRL\", \"rate\": 1.1 }"))
        .andExpect(status().is(201))
        .andExpect(content()
            .json("{ \"code\":\"BRL\", \"rate\": 1.1 }"));
  }

  @Test
  @DisplayName("Test create currency already exists")
  void createCurrentAlreadyExistsTest() throws Exception {

    final CurrencyRequestDto currencyDto = new CurrencyRequestDto();
    currencyDto.setRate(1.1);
    currencyDto.setCode("BRL");

    final Currency currency = new Currency();
    currency.setRate(1.1);
    currency.setCode("BRL");

    given(currencyService.create(currencyDto))
        .willThrow(new CurrencyExistException(""));

    mvc.perform(post("/currency")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{ \"code\":\"BRL\", \"rate\": 1.1 }"))
        .andExpect(status().is(400))
        .andExpect(content()
            .json("{\"message\":\"The currency already exists\"}"));
  }


  @Test
  @DisplayName("Test update currency")
  void updateCurrentTest() throws Exception {

    final CurrencyRequestDto currencyDto = new CurrencyRequestDto();
    currencyDto.setRate(1.1);
    currencyDto.setCode("BRL");

    final Currency currency = new Currency();
    currency.setRate(1.1);
    currency.setCode("BRL");

    given(currencyService.update(currencyDto))
        .willReturn(currency);

    mvc.perform(put("/currency/{currency}", "BRL")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"rate\": 1.1 }"))
        .andExpect(status().is(200))
        .andExpect(content()
            .json("{ \"code\":\"BRL\", \"rate\": 1.1 }"));
  }

  @Test
  @DisplayName("Test update currency not exist")
  void updateCurrentNotExistTest() throws Exception {

    final CurrencyRequestDto currencyDto = new CurrencyRequestDto();
    currencyDto.setRate(1.1);
    currencyDto.setCode("BRL");

    final Currency currency = new Currency();
    currency.setRate(1.1);
    currency.setCode("BRL");

    given(currencyService.update(currencyDto))
        .willThrow(new CurrencyNotExistException(""));

    mvc.perform(put("/currency/{currency}", "BRL")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"rate\": 1.1 }"))
        .andExpect(status().is(404));
  }

  @Test
  @DisplayName("Test delete currency")
  void deleteCurrentTest() throws Exception {

    given(currencyService.getCurrency("BRL"))
        .willReturn(new Currency());

    mvc.perform(delete("/currency/{currency}", "BRL"))
        .andExpect(status().is(204));
  }

  @Test
  @DisplayName("Test delete currency")
  void deleteCurrentNotExistTest() throws Exception {

    willThrow(new CurrencyNotExistException("BRL"))
        .given(currencyService)
        .deleteByCurrency("BRL");

    mvc.perform(delete("/currency/{currency}", "BRL"))
        .andExpect(status().is(404));
  }
}