<?php

declare(strict_types=1);

namespace App\Model;

use DateTimeInterface;
use Money\Money;

class Currency
{
    private string $code;
    private Money $value;
    private string $source;
    private DateTimeInterface $createdAt;
    private DateTimeInterface $updatedAt;

    public function getCode(): string
    {
        return $this->code;
    }

    public function getValue(): Money
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
        $this->value = $value;
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
