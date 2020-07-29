<?php

declare(strict_types=1);

namespace App\Entity;

use App\ValueObject\CurrencyId;
use DateTimeImmutable;
use Laminas\InputFilter\InputFilterInterface;
use LosMiddleware\ApiServer\Entity\Entity;

class CurrencyEntity extends Entity implements EntityInterface
{
    private CurrencyId $id;
    private string $name;
    private DateTimeImmutable $createdAt;
    private DateTimeImmutable $updatedAt;

    private function __construct(
        CurrencyId $id,
        string $name,
        DateTimeImmutable $createdAt,
        DateTimeImmutable $updatedAt
    ) {
        $this->id        = $id;
        $this->name      = $name;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public static function fromArray(array $data): self
    {
        return new self(
            isset($data['id']) ? CurrencyId::fromString($data['id']) : CurrencyId::generate(),
            $data['name'],
            new DateTimeImmutable($data['createdAt'] ?? 'now'),
            new DateTimeImmutable($data['updatedAt'] ?? 'now'),
        );
    }

    public function id(): CurrencyId
    {
        return $this->id;
    }

    public function name(): string
    {
        return $this->name;
    }

    public function createdAt(): DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function updatedAt(): DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function getInputFilter(): InputFilterInterface
    {
        if ($this->inputFilter === null) {
            $this->inputFilter = new CurrencyInputFilter();
        }

        return $this->inputFilter;
    }

    public function getArrayCopy(string $dateFormat = 'Y-m-d H:i:s'): array
    {
        return [
            'id' => $this->id->toString(),
            'name' => $this->name,
            'createdAt' => $this->createdAt->format($dateFormat),
            'updatedAt' => $this->updatedAt->format($dateFormat),
        ];
    }
}
