<?php

declare(strict_types=1);

namespace App\Entity;

use Laminas\Db\ResultSet\AbstractResultSet;

use function is_array;

class CurrencyResultSetPropotype extends AbstractResultSet
{
    public function current(): ?CurrencyEntity
    {
        if ($this->buffer === null) {
            $this->buffer = -2; // implicitly disable buffering from here on
        } elseif (is_array($this->buffer) && isset($this->buffer[$this->position])) {
            return $this->buffer[$this->position];
        }

        $data    = $this->dataSource->current();
        $current = is_array($data) ? CurrencyEntity::fromArray($data) : null;

        if (is_array($this->buffer)) {
            $this->buffer[$this->position] = $current;
        }

        return $current;
    }
}
