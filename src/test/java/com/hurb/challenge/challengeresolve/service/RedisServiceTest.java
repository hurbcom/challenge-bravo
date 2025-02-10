package com.hurb.challenge.challengeresolve.service;

import com.hurb.challenge.challengeresolve.client.RedisClient;
import com.hurb.challenge.challengeresolve.model.AwesomeApi;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import redis.clients.jedis.Jedis;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RedisServiceTest {
    @Mock
    private RedisClient redisClient;


    @InjectMocks
    RedisService underTest = new RedisService();

    @Test
    void testCheckKeyWhenReturningTrue() {
        Jedis jedis = mock(Jedis.class);
        when(redisClient.redisConfig()).thenReturn(jedis);
        when(jedis.exists(anyString())).thenReturn(true);
        assertTrue(underTest.checkKey("test"));
    }

    @Test
    void testCheckKeyWhenReturningFalse() {
        Jedis jedis = mock(Jedis.class);
        when(redisClient.redisConfig()).thenReturn(jedis);
        when(jedis.exists(anyString())).thenReturn(false);
        assertFalse(underTest.checkKey("test"));
    }

    @Test
    void testCheckGetTax() {
        Jedis jedis = mock(Jedis.class);
        when(redisClient.redisConfig()).thenReturn(jedis);
        when(jedis.get(anyString())).thenReturn("test-string");
        assertEquals("test-string", underTest.getTax("test"));
    }

    @Test
    void testIncludeInCluster() {
        Jedis jedis = mock(Jedis.class);
        AwesomeApi awesomeApi = new AwesomeApi();
        awesomeApi.setLow(BigDecimal.TEN);
        awesomeApi.setHigh(BigDecimal.TEN);
        awesomeApi.setCode("test");
        awesomeApi.setCodein("test");
        when(redisClient.redisConfig()).thenReturn(jedis);
        underTest.includeInCluster(awesomeApi);
    }


}