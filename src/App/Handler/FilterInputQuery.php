<?php

declare(strict_types=1);

namespace App\Handler;

use Laminas\Filter;

trait FilterInputQuery
{
    private function filterString(string $value): ?string
    {
        $finalValue = (new Filter\StringTrim())->filter($value);
        $finalValue = (new Filter\StripTags())->filter($finalValue);
        $finalValue = (new Filter\StripNewlines())->filter($finalValue);

        return ! empty($finalValue) ? $finalValue : null;
    }
}
