package com.bravo.exchange.controller;

import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.bravo.error.exception.CurrencyNotExistException;
import com.bravo.exchange.service.ExchangeService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpMethod;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
class ExchangeControllerTest {

  @MockBean
  private ExchangeService exchangeService;
  @Autowired
  private MockMvc mvc;

  @Test
  @DisplayName("Test currency not exist")
  void containsCurrencyNotExistTest() throws Exception {

    given(exchangeService.exchange(anyString(), anyDouble()))
        .willThrow(new CurrencyNotExistException("BRL"));

    mvc.perform(MockMvcRequestBuilders.request(HttpMethod.GET, "/exchange")
        .param("from", "BRL")
        .param("amount", "1"))
        .andExpect(content().json("{\"message\":\"This currency in 'FROM' parameter not exist\"}"))
        .andExpect(status().is(400));
  }

  @Test
  @DisplayName("Test 'FROM' param empty")
  void emptyFromParamTest() throws Exception {

    mvc.perform(MockMvcRequestBuilders.request(HttpMethod.GET, "/exchange")
        .param("from", "")
        .param("amount", "1"))
        .andExpect(content().json("{\"message\":\"Invalid 'FROM' parameter\"}"))
        .andExpect(status().is(400));
  }

  @Test
  @DisplayName("Test 'AMOUNT' param 0")
  void zeroAmountParamTest() throws Exception {

    mvc.perform(MockMvcRequestBuilders.request(HttpMethod.GET, "/exchange")
        .param("from", "BRL")
        .param("amount", "0"))
        .andExpect(content().json("{\"message\":\"The 'AMOUNT' must be > 0.00\"}"))
        .andExpect(status().is(400));
  }
}