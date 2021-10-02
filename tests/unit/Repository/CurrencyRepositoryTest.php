<?php

declare(strict_types=1);

namespace App\Repository;

use App\Connection;
use App\Model\Currency;
use DateTimeInterface;
use Money\Money;
use PHPUnit\Framework\TestCase;

final class CurrencyRepositoryTest extends TestCase
{
    public function testInsertAndRetrieve()
    {
        $conn = new Connection();

        $code = 'BRL';
        $value = Money::USD('100');
        $source = 'undefined';
        $currency = Currency::create($code, $value);

        $repo = new CurrencyRepository($conn);
        $repo->set($currency);
        $cur = $repo->get('BRL');

        $this->assertNotEmpty($cur);
        $this->assertEquals($code, $cur->getCode());
        $this->assertTrue($value->equals($cur->getValue()));
        $this->assertEquals($source, $cur->getSource());
        $this->assertInstanceOf(
            DateTimeInterface::class,
            $cur->getCreatedAt()
        );
        $this->assertInstanceOf(
            DateTimeInterface::class,
            $cur->getUpdatedAt()
        );
    }
}
