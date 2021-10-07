<?php

declare(strict_types=1);

namespace App\Repository;

use App\Connection;
use App\Model\Currency;
use Brick\Math\BigDecimal;
use DateTimeInterface;
use PHPUnit\Framework\TestCase;

final class CurrencyRepositoryTest extends TestCase
{
    public function testInsertAndRetrieve()
    {
        $conn = new Connection();

        $code = 'BRL';
        $value = BigDecimal::of('100');
        $source = 'undefined';
        $currency = Currency::create($code, $value);

        $repo = new CurrencyRepository($conn);
        $repo->set($currency);
        $cur = $repo->get('BRL');

        $this->assertNotEmpty($cur);
        $this->assertEquals($code, $cur->getCode());
        $this->assertEquals($value, $cur->getValue());
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

    public function testDelete()
    {
        $conn = new Connection();
        $repo = new CurrencyRepository($conn);
        $code = 'BRL';
        $repo->set(Currency::create($code, BigDecimal::zero()));

        $this->assertTrue($repo->delete($code));
        $cur = $repo->get($code);
        $this->assertEmpty($cur);
    }

    public function testDeleteNotExistent()
    {
        $conn = new Connection();
        $repo = new CurrencyRepository($conn);
        $code = 'xxxxxx';

        $cur = $repo->get($code);
        $this->assertEmpty($cur);
        $this->assertFalse($repo->delete($code));
    }
}
