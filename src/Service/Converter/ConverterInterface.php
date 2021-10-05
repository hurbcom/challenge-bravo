<?php

declare(strict_types=1);

namespace App\Service\Converter;

use App\Model\Currency;
use Brick\Math\BigDecimal;

interface ConverterInterface
{
    public function from(Currency $cur): ConverterInterface;
    public function to(Currency $cur): ConverterInterface;
    public function amount(BigDecimal $amount): BigDecimal;
}
