package br.com.hu.test.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import br.com.hu.App;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = App.class)
@WebAppConfiguration
public class CurrencyControllerTest {

	private MockMvc mockMvc;

	@Autowired
	private WebApplicationContext webApplicationContext;

	@Before
	public void setup() throws Exception {
		this.mockMvc = webAppContextSetup(webApplicationContext).build();
	}

	@Test
	public void getCurrencyOk() throws Exception {
		mockMvc.perform(get("/v1/currency?from=BRL&to=EUR&amount=123.45")).andExpect(status().is2xxSuccessful());
	}
	
	@Test
	public void getCurrencyNullAmount() throws Exception {
		mockMvc.perform(get("/v1/currency?from=BRL&to=EUR&amount=")).andExpect(status().is4xxClientError());
	}
	
	@Test
	public void getCurrencyNullTo()  throws Exception{
		mockMvc.perform(get("/v1/currency?from=BRL&to=&amount=110.0")).andExpect(status().is4xxClientError());
	}
	
	@Test
	public void getCurrencyNullFrom()  throws Exception{
		mockMvc.perform(get("/v1/currency?from=&to=BRL&amount=110.0")).andExpect(status().is4xxClientError());
	}
	
	@Test
	public void getCurrencyNullBoth()  throws Exception{
		mockMvc.perform(get("/v1/currency?from=&to=&amount=110.0")).andExpect(status().is4xxClientError());
	}
	
	@Test
	public void getCurrencyInvalidUri()  throws Exception{
		mockMvc.perform(get("/v1/currency?from=&to=")).andExpect(status().is4xxClientError());
	}
	
	@Test
	public void getCurrencyBTC() throws Exception {
		mockMvc.perform(get("/v1/currency?from=BTC&to=EUR&amount=123.45")).andExpect(status().is4xxClientError());
	}
	
	
	
	
}
