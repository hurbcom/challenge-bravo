<?php

declare(strict_types=1);

namespace App\Model;

use App\Exception\CurrencyCodeException;
use Brick\Math\BigDecimal;
use DateTimeImmutable;
use DateTimeInterface;

class Currency
{
    private string $code;
    private string $value;
    private string $source;
    private string $created_at;
    private ?string $updated_at;

    public static function create(
        string $code,
        string $value,
        ?string $source = null,
        ?DateTimeInterface $createdAt = null,
        ?DateTimeInterface $updatedAt = null
    ) {
        $cur = new Currency();
        $cur->setCode($code);
        $cur->setValue($value);
        $cur->setSource($source ?? 'undefined');
        $cur->setCreatedAt($createdAt ?? new DateTimeImmutable());
        $cur->setUpdatedAt($updatedAt ?? new DateTimeImmutable());

        return $cur;
    }

    /**
     * Validate and makes the currency code uppercase
     *
     * @param string $code
     * @return string
     * @throws CurrencyCodeException on invalid currency format
     */
    public static function normalizeCode(string $code): string
    {
        $normalizedCode = strtoupper($code);

        if (!preg_match('/^[A-Z]{3}$/', $normalizedCode)) {
            throw new CurrencyCodeException("Invalid format: Don't match 3 letters code format.");
        }

        return $normalizedCode;
    }

    public function getCode(): string
    {
        return $this->code;
    }

    public function getValue(): BigDecimal
    {
        return BigDecimal::of($this->value);
    }

    public function getSource(): string
    {
        return $this->source;
    }

    public function getCreatedAt(): DateTimeInterface
    {
        return new DateTimeImmutable($this->created_at);
    }

    public function getUpdatedAt(): DateTimeInterface
    {
        if (empty($this->updated_at)) {
            return new DateTimeImmutable();
        }

        return new DateTimeImmutable($this->updated_at);
    }

    public function getCreatedAtAsSQLString(): string
    {
        return (new DateTimeImmutable($this->created_at))->format("Y-m-d H:i:s");
    }

    public function getUpdatedAtAsSQLString(): ?string
    {
        if (empty($this->updated_at)) {
            return (new DateTimeImmutable())->format("Y-m-d H:i:s");
        }

        return (new DateTimeImmutable($this->updated_at))->format("Y-m-d H:i:s");
    }

    public function setCode(string $code)
    {
        $this->code = $code;
    }

    public function setValue(string $value)
    {
        $this->value = (string) BigDecimal::of($value);
    }

    public function setSource(string $source)
    {
        $this->source = $source;
    }

    public function setCreatedAt(DateTimeInterface $createdAt)
    {
        $this->created_at = $createdAt->format("Y-m-d H:i:s");
    }

    public function setUpdatedAt(DateTimeInterface $updatedAt)
    {
        $this->updated_at = $updatedAt->format("Y-m-d H:i:s");
    }
}
