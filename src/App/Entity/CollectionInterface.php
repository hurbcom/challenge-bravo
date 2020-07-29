<?php

declare(strict_types=1);

namespace App\Entity;

use Countable;
use IteratorAggregate;

interface CollectionInterface extends Countable, IteratorAggregate
{
}
