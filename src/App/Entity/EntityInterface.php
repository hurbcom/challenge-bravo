<?php

declare(strict_types=1);

namespace App\Entity;

use App\ValueObject\CurrencyId;
use Laminas\InputFilter\InputFilterAwareInterface;
use Laminas\Stdlib\ArraySerializableInterface;

interface EntityInterface extends ArraySerializableInterface, InputFilterAwareInterface
{
    public function id(): CurrencyId;
}
