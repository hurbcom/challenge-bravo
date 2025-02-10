package com.hurb.challenge.challengeresolve.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.hurb.challenge.challengeresolve.client.AwesomeApiClients;
import com.hurb.challenge.challengeresolve.model.AwesomeApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AwesomeApiService {
    @Autowired
    AwesomeApiClients awesomeApiClients;

    public AwesomeApi fetchCurrency(String originalCcurrency, String finalcurrency) {
        try {
            return this.awesomeApiClients.fetchCurrency(originalCcurrency, finalcurrency);

        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
