<?php
declare(strict_types=1);

namespace AppTest\Service;

use App\Service\ExternalApiService;
use App\Service\ExternalApiServiceFactory;
use AppTest\BoostrapContainer;
use PHPUnit\Framework\TestCase;

class ExternalApiServiceFactoryTest extends TestCase
{
    use BoostrapContainer;

    public function testInvoke()
    {
        $factory = new ExternalApiServiceFactory();
        $service = $factory($this->createContainer());
        $this->assertInstanceOf(ExternalApiService::class, $service);
    }
}