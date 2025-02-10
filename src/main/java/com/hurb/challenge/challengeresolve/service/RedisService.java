package com.hurb.challenge.challengeresolve.service;

import com.hurb.challenge.challengeresolve.client.RedisClient;
import com.hurb.challenge.challengeresolve.model.AwesomeApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;

import java.math.BigDecimal;


@Service
public class RedisService {
    @Autowired
    private RedisClient redisClient;

    public void includeInCluster(AwesomeApi awesomeApi) {
        includeInCluster(awesomeApi.generateKey(), awesomeApi.generateValueKey());
        includeInCluster(awesomeApi.generateInvertedKey(), awesomeApi.generateValueInvertedKey());
    }

    public void includeInCluster(String key, BigDecimal value) {
        Jedis jedis = redisClient.redisConfig();
        jedis.set(key, value.toString());
    }

    public Boolean checkKey(String key) {
        Jedis jedis = redisClient.redisConfig();
        return jedis.exists(key);
    }

    public String getTax(String key) {
        Jedis jedis = redisClient.redisConfig();
        return jedis.get(key);
    }
}
