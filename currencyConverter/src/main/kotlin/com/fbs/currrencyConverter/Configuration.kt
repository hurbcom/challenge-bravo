package com.fbs.currrencyConverter

import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.client.ClientHttpRequestInterceptor
import org.springframework.web.client.RestTemplate

@Configuration
class Configuration {

    @Bean
    fun restTemplate(restTemplateBuilder: RestTemplateBuilder): RestTemplate {

        val interceptor = ClientHttpRequestInterceptor { request, body, execution ->
            request.headers.add("user-agent", "spring")
            execution.execute(request, body)
        }

        return restTemplateBuilder.additionalInterceptors(interceptor).build()
    }
}