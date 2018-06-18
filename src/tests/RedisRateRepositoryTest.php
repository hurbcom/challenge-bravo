<?php

use App\Repositories\RateRepository;
use App\Repositories\RedisRateRepository;
use App\Helpers\CacheClient;

class RedisRateRepositoryTest extends TestCase
{

    public function testGetRateCached()
    {
        // setup
        $currencyCode = "BRL";
        $expected = 3.736404;

        $redisManager = $this->createMock(CacheClient::class);

        $redisManager
            ->expects($this->once())
                ->method('isSet')
                ->willReturn(true);
        $redisManager
            ->expects($this->once())
                ->method('getValueOf')
                ->willReturn($expected);

        $rateRepository = $this->createMock(RateRepository::class);

        $RedisRateRepository = new RedisRateRepository($redisManager, $rateRepository);


        // execution
        $actual = $RedisRateRepository->getBallastRateFor($currencyCode);

        // assertions
        $this->assertEquals($expected, $actual);
    }

    public function testGetRateWithoutCache()
    {
        // setup
        $currencyCode = "BRL";
        $expected = 3.736404;

        $redisManager = $this->createMock(CacheClient::class);

        $redisManager
            ->expects($this->once())
                ->method('isSet')
                ->willReturn(false);

        $redisManager
            ->expects($this->once())
            ->method('setWith');

        $redisManager
            ->expects($this->once())
            ->method('getValueOf')
            ->willReturn($expected);

        $rateRepository = $this->createMock(RateRepository::class);

        $rateRepository->expects($this->once())
            ->method('getBallastRateFor');

        $RedisRateRepository = new RedisRateRepository($redisManager, $rateRepository);


        // execution
        $actual = $RedisRateRepository->getBallastRateFor($currencyCode);

        // assertions
        $this->assertEquals($expected, $actual);
    }
}