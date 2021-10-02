<?php

declare(strict_types=1);

namespace App\Model;

use App\Model\Currency as Currency;
use Brick\Math\Exception\NumberFormatException;
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

        $value = '0.005';
        $cur->setValue($value);
        $this->assertEquals($value, $cur->getValue());

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
        $value = '0.001';
        $source = 'static';

        $cur = Currency::create($code, $value, $source);

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

    public function testCreateConstructorMethodWithInvalidString()
    {
        $code = 'BRL';
        $stringValue = 'test';
        $this->expectException(NumberFormatException::class);
        Currency::create($code, $stringValue);
    }
}
