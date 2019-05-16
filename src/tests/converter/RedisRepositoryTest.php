<?php

namespace Hurb\Tests\CurrencyConverter\CurrencyConverter;

use Hurb\CurrencyConverter\Repositories\RedisRepository;
use PHPUnit\Framework\TestCase;
use Predis\ClientInterface as Client;

class RedisRepositoryTest extends TestCase
{
    public function testGetValueWithValidKeySucceed()
    {
        $key = 'USD';
        $value = 1.0;

        $client = $this->createMock(Client::class);
        $client
            ->expects($this->once())
            ->method('__call')
            ->with(
                $this->equalTo('get'),
                $this->equalTo([$key])
            )
            ->willReturn($value);

        $repository = new RedisRepository($client);

        $this->assertEquals($value, $repository->get($key));
    }

    public function testGetValueWithInvalidKeyFailed()
    {
        $key = 'USD';

        $client = $this->createMock(Client::class);
        $client
            ->expects($this->once())
            ->method('__call')
            ->with(
                $this->equalTo('get'),
                $this->equalTo([$key])
            )
            ->willReturn(null);

        $repository = new RedisRepository($client);

        $this->assertNull($repository->get($key));
    }

    public function testSaveValueWithKeySucceed()
    {
        $key = 'USD';
        $value = 1.0;

        $client = $this->createMock(Client::class);
        $client
            ->expects($this->once())
            ->method('__call')
            ->with(
                $this->equalTo('set'),
                $this->equalTo([$key, $value])
            );

        $repository = new RedisRepository($client);

        $repository->save($key, $value);
    }
}
