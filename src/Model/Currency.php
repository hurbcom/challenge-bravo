<?php

declare(strict_types=1);

namespace App\Model;

use DateTime;
use DateTimeInterface;
use Money\Currencies\ISOCurrencies;
use Money\Currency as MoneyCurrency;
use Money\Formatter\DecimalMoneyFormatter;
use Money\Money;
use Money\Parser\DecimalMoneyParser;

class Currency
{
    private string $code;
    private string $value;
    private string $source;
    private DateTimeInterface $createdAt;
    private DateTimeInterface $updatedAt;

    public static function create(
        string $code,
        int|string|Money $value,
        ?string $source = null,
        ?DateTimeInterface $createdAt = null,
        ?DateTimeInterface $updatedAt = null
    ) {
        $cur = new Currency();
        $cur->setCode($code);
        $cur->setValue($value instanceof Money ? $value : Money::USD($value));
        $cur->setSource($source ?? 'undefined');
        $cur->setCreatedAt($createdAt ?? new DateTime());
        $cur->setUpdatedAt($updatedAt ?? new DateTime());

        return $cur;
    }

    public function getCode(): string
    {
        return $this->code;
    }

    public function getValue(): Money
    {
        $moneyParser = new DecimalMoneyParser(new ISOCurrencies());
        $money = $moneyParser->parse($this->value, new MoneyCurrency('USD'));
        return $money;
    }

    public function getValueAsString(): string
    {
        return $this->value;
    }

    public function getSource(): string
    {
        return $this->source;
    }

    public function getCreatedAt(): DateTimeInterface
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setCode(string $code)
    {
        $this->code = $code;
    }

    public function setValue(Money $value)
    {
        $formatter = new DecimalMoneyFormatter(new ISOCurrencies());
        $this->value = $formatter->format($value);
    }

    public function setSource(string $source)
    {
        $this->source = $source;
    }

    public function setCreatedAt(DateTimeInterface $createdAt)
    {
        $this->createdAt = $createdAt;
    }

    public function setUpdatedAt(DateTimeInterface $updatedAt)
    {
        $this->updatedAt = $updatedAt;
    }
}
