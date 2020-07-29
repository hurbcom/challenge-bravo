<?php

declare(strict_types=1);

namespace App\ValueObject;

use InvalidArgumentException;
use Ramsey\Uuid\Codec\TimestampFirstCombCodec;
use Ramsey\Uuid\Generator\CombGenerator;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidFactory;
use Ramsey\Uuid\UuidInterface;

trait Id
{
    private UuidInterface $uuid;

    public static function generate(): self
    {
        $factory   = new UuidFactory();
        $generator = new CombGenerator($factory->getRandomGenerator(), $factory->getNumberConverter());
        $codec     = new TimestampFirstCombCodec($factory->getUuidBuilder());
        $factory->setRandomGenerator($generator);
        $factory->setCodec($codec);
        Uuid::setFactory($factory);

        return new self(Uuid::uuid4());
    }

    public static function fromString(string $id): self
    {
        if (! Uuid::isValid($id)) {
            throw new InvalidArgumentException('Invalid id "' . $id . '"');
        }

        return new self(Uuid::fromString($id));
    }

    private function __construct(UuidInterface $uuid)
    {
        $this->uuid = $uuid;
    }

    public function toString(): string
    {
        return $this->uuid->toString();
    }

    public function __toString(): string
    {
        return $this->toString();
    }

    public static function isValid(string $id): bool
    {
        return Uuid::isValid($id);
    }
}
