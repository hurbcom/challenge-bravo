<?php
declare(strict_types=1);

namespace AppTest\Service;

use App\Exception\InvalidCurrencies;
use App\Mapper\CurrencyMapper;
use App\Service\ExchangeService;
use App\Service\ExternalApiService;
use Laminas\Cache\Storage\StorageInterface;
use PHPUnit\Framework\TestCase;
use Prophecy\Argument;
use Prophecy\PhpUnit\ProphecyTrait;

class ExchangeServiceTest extends TestCase
{
    use ProphecyTrait;

    public function testConstruct()
    {
        $currencyMapper = $this->prophesize(CurrencyMapper::class);
        $cache = $this->prophesize(StorageInterface::class);
        $externalApiService = $this->prophesize(ExternalApiService::class);

        $service = new ExchangeService($currencyMapper->reveal(), $cache->reveal(), $externalApiService->reveal());
        $this->assertInstanceOf(ExchangeService::class, $service);
    }

    public function testExchangeExceptionCurrencyNotExists()
    {
        $currencyMapper = $this->prophesize(CurrencyMapper::class);
        $currencyMapper->fetchByNames(Argument::any())->willReturn(null);

        $cache = $this->prophesize(StorageInterface::class);
        $cache->hasItem(Argument::any())->willReturn(false);

        $externalApiService = $this->prophesize(ExternalApiService::class);

        $service = new ExchangeService($currencyMapper->reveal(), $cache->reveal(), $externalApiService->reveal());
        $this->expectExceptionObject(InvalidCurrencies::create());
        $service->exchange('BRL', 'USD', 10);
    }

    public function testExchangeWithoutCache()
    {
        $currencyMapper = $this->prophesize(CurrencyMapper::class);
        $currencyMapper->fetchByNames(Argument::is(['USD', 'BRL']))->willReturn([['name' => 'USD'], ['name' => 'BRL']]);

        $cache = $this->prophesize(StorageInterface::class);
        $cache->hasItem(Argument::any())->willReturn(false);
        $cache->setItem(Argument::any(), Argument::any())->willReturn(true);

        $externalApiService = $this->prophesize(ExternalApiService::class);
        $externalApiService->fetchUpdatedCurrency(Argument::is('USD'), Argument::is('BRL'))->willReturn(5.512);

        $service = new ExchangeService($currencyMapper->reveal(), $cache->reveal(), $externalApiService->reveal());
        $result = $service->exchange('USD', 'BRL', 10);
        $this->assertEquals(55.12, $result);
    }

    public function testExchangeWithCache()
    {
        $currencyMapper = $this->prophesize(CurrencyMapper::class);
        $currencyMapper->fetchByNames(Argument::is(['USD', 'BRL']))->willReturn([['name' => 'USD'], ['name' => 'BRL']]);

        $cache = $this->prophesize(StorageInterface::class);
        $cacheKey = md5(ExchangeService::class . 'exchange' . var_export(['USD', 'BRL'], true));
        $cache->hasItem(Argument::is($cacheKey))->willReturn(true);
        $cache->getItem(Argument::is($cacheKey))->willReturn(5.355);

        $cacheKey = md5(ExchangeService::class . 'exchange' . var_export(['BRL', 'USD'], true));
        $cache->hasItem(Argument::is($cacheKey))->willReturn(true);
        $cache->getItem(Argument::is($cacheKey))->willReturn(0.0335);

        $externalApiService = $this->prophesize(ExternalApiService::class);

        $service = new ExchangeService($currencyMapper->reveal(), $cache->reveal(), $externalApiService->reveal());
        $result = $service->exchange('USD', 'BRL', 10);
        $this->assertEquals(53.55, $result);
    }
}