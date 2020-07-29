<?php
declare(strict_types=1);

namespace AppTest\Service;

use App\Service\CurrencyService;
use App\Service\CurrencyServiceFactory;
use App\Service\ExchangeService;
use App\Service\ExchangeServiceFactory;
use AppTest\BoostrapContainer;
use PHPUnit\Framework\TestCase;

class ExchangeServiceFactoryTest extends TestCase
{
    use BoostrapContainer;

    public function testInvoke()
    {
        $factory = new ExchangeServiceFactory();
        $service = $factory($this->createContainer());
        $this->assertInstanceOf(ExchangeService::class, $service);
    }
}