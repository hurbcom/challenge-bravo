package com.hurb.challenge.challengeresolve.client;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hurb.challenge.challengeresolve.model.AwesomeApi;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
@TestPropertySource(properties = {"http.awesomeapi.url=http://example.com/api"})
class AwesomeApiClientsTest {
    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private AwesomeApiClients awesomeApiClients;

    @Value("${http.awesomeapi.url}")
    private String awesomeApiUrl;

    @Test
    void testFetchCurrency() throws JsonProcessingException {
        String mockResponse = "{\"USD_BRL\": {\"code\":\"USD\",\"codein\":\"BRL\",\"name\":\"Dollar/Real\",\"high\":\"5.2421\",\"low\":\"5.211\",\"varBid\":\"0.023\",\"pctChange\":\"0.44\",\"bid\":\"5.2221\",\"ask\":\"5.2231\",\"timestamp\":\"1652025254\",\"create_date\":\"2022-05-10 17:14:14\"}}";
        when(restTemplate.getForObject(anyString(), eq(String.class))).thenReturn(mockResponse);
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, AwesomeApi> expectedMap = objectMapper.readValue(mockResponse, new TypeReference<Map<String, AwesomeApi>>() {
        });
        AwesomeApi expectedAwesomeApi = expectedMap.values().stream().toList().get(0);

        AwesomeApi result = awesomeApiClients.fetchCurrency("USD", "BRL");

        assertEquals(expectedAwesomeApi, result);
    }
}

