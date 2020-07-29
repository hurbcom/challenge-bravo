<?php
declare(strict_types=1);

namespace AppTest\Service;

use App\Service\CurrencyService;
use App\Service\CurrencyServiceFactory;
use App\Service\ExchangeService;
use App\Service\ExchangeServiceFactory;
use App\Service\ExternalApiService;
use App\Service\ExternalApiServiceFactory;
use AppTest\BoostrapContainer;
use PHPUnit\Framework\TestCase;
use Prophecy\Argument;
use Prophecy\PhpUnit\ProphecyTrait;

class ExternalApiServiceTest extends TestCase
{
    use BoostrapContainer, ProphecyTrait;

    public function testConstruct()
    {
        $config = $this->createContainer()->get('config');
        $service = new ExternalApiService(
            $config['external_api']['base_uri'],
            $config['external_api']['password'] ?? null
        );
        $this->assertInstanceOf(ExternalApiService::class, $service);
    }

    public function testFetchUpdatedCurrency()
    {
        $service = $this->prophesize(ExternalApiService::class);

        // simulate sucess
        $service->fetchUpdatedCurrency(Argument::is('USD'), Argument::is('BRL'))->willReturn(5.531);

        // simulating status code !== 200
        $service->fetchUpdatedCurrency(Argument::is('BRL'), Argument::is('XXX'))->willReturn(0.00);

        $service = $service->reveal();

        $result = $service->fetchUpdatedCurrency('USD', 'BRL');
        $this->assertIsFloat($result);

        $result = $service->fetchUpdatedCurrency('BRL', 'XXX');
        $this->assertEquals(0.00, $result);
    }
}