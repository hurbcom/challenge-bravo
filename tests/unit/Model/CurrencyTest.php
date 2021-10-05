<?php

declare(strict_types=1);

namespace App\Model;

use App\Exception\CurrencyCodeException;
use App\Model\Currency as Currency;
use Brick\Math\BigDecimal;
use DateTime;
use DateTimeInterface;
use PHPUnit\Framework\TestCase;

final class CurrencyTest extends TestCase
{
    public function testCanInstantiate()
    {
        $cur = new Currency();

        $this->assertInstanceOf(
            Currency::class,
            $cur
        );
    }

    public function testGettersAndSetters()
    {
        $cur = new Currency();

        $code = 'BRL';
        $cur->setCode($code);
        $this->assertEquals($code, $cur->getCode());

        $value = BigDecimal::of('0.005');
        $cur->setValue($value);
        $this->assertTrue($value->isEqualTo($cur->getValue()));

        $source = 'static';
        $cur->setSource($source);
        $this->assertEquals($source, $cur->getSource());

        $createdAt = new DateTime('15 minutes ago');
        $cur->setCreatedAt($createdAt);
        $this->assertInstanceOf(
            DateTimeInterface::class,
            $cur->getCreatedAt()
        );

        $updatedAt = new DateTime();
        $cur->setUpdatedAt($updatedAt);
        $this->assertInstanceOf(
            DateTimeInterface::class,
            $cur->getUpdatedAt()
        );
    }

    public function testCreateConstructorMethod()
    {
        $code = 'BRL';
        $value = BigDecimal::of('0.001');
        $source = 'static';

        $cur = Currency::create($code, $value, $source);

        $this->assertEquals($code, $cur->getCode());
        $this->assertTrue($value->isEqualTo($cur->getValue()));
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

    public function testNormalizeCodeStaticMethod()
    {
        // Should return uppercase
        $code1 = 'brl';
        $expected1 = 'BRL';
        $current1 = Currency::normalizeCode($code1);
        $this->assertEquals($expected1, $current1);

        // Should be equal
        $code2 = 'USD';
        $current2 = Currency::normalizeCode($code2);
        $this->assertEquals($code2, $current2);

        // Should throw exception
        $this->expectException(CurrencyCodeException::class);
        Currency::normalizeCode('dasdwqe');
    }
}
