<?php

declare(strict_types=1);

namespace App\Model;

use App\Model\Currency as Currency;
use DateTime;
use DateTimeInterface;
use Money\Money;
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

        $value = Money::USD(1);
        $cur->setValue($value);
        $this->assertTrue($value->equals($cur->getValue()));

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
        $value = Money::USD(1);
        $source = 'static';

        $cur = Currency::create($code, $value, $source);

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

    public function testCreateConstructorMethodWithString()
    {
        $code = 'BRL';
        $stringValue = '2';
        $value = Money::USD('2');
        $cur = Currency::create($code, $stringValue);
        $this->assertTrue($value->equals($cur->getValue()));
    }

    public function testCreateConstructorMethodWithInt()
    {
        $code = 'BRL';
        $intValue = 2;
        $value = Money::USD(2);
        $cur = Currency::create($code, $intValue);
        $this->assertTrue($value->equals($cur->getValue()));
    }
}
