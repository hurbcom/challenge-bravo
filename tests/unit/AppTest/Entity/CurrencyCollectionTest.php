<?php

declare(strict_types=1);

namespace AppTest\Entity;

use App\Entity\CollectionInterface;
use App\Entity\CurrencyCollection;
use Laminas\Paginator\Adapter\DbTableGateway;
use Laminas\Paginator\Paginator;
use PHPUnit\Framework\TestCase;
use Prophecy\PhpUnit\ProphecyTrait;

class CurrencyCollectionTest extends TestCase
{
    use ProphecyTrait;

    public function testConstruct()
    {
        $dbAdapter = $this->prophesize(DbTableGateway::class);
        $collection = new CurrencyCollection($dbAdapter->reveal());

        $this->assertInstanceOf(Paginator::class, $collection);
        $this->assertInstanceOf(CollectionInterface::class, $collection);
    }
}
