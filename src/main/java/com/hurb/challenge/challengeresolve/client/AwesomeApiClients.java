package com.hurb.challenge.challengeresolve.client;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hurb.challenge.challengeresolve.model.AwesomeApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class AwesomeApiClients {
    @Value("${http.awesomeapi.url}")
    private String awesomeApiUrl;

    private ObjectMapper objectMapper = new ObjectMapper();
    private RestTemplate restTemplate = new RestTemplate();

    public AwesomeApi fetchCurrency(String originalCurrency, String finalCurrency) throws JsonProcessingException {
        String url = buildUriToSearch(originalCurrency, finalCurrency);
        String rawData = restTemplate.getForObject(url, String.class);
        Map<String, AwesomeApi> map = objectMapper.readValue(rawData, new TypeReference<Map<String, AwesomeApi>>() {
        });
        return map.values().stream().toList().get(0);
    }

    private String buildUriToSearch(String originalCurrency, String finalCurrency) {
        String searchConversion = originalCurrency + "-" + finalCurrency;
        return awesomeApiUrl + searchConversion;
    }

}
