<?php
declare(strict_types=1);

namespace AppTest\Service;

use App\Service\CurrencyService;
use App\Service\CurrencyServiceFactory;
use AppTest\BoostrapContainer;
use PHPUnit\Framework\TestCase;

class CurrencyServiceFactoryTest extends TestCase
{
    use BoostrapContainer;

    public function testInvoke()
    {
        $factory = new CurrencyServiceFactory();
        $service = $factory($this->createContainer());
        $this->assertInstanceOf(CurrencyService::class, $service);
    }
}