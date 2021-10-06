<?php

declare(strict_types=1);

namespace App\Service\Converter;

use App\Exception\CurrencyValueException;
use App\Model\Currency;
use Brick\Math\BigDecimal;
use Brick\Math\RoundingMode;

class ConverterService implements ConverterInterface
{
    private Currency $from;
    private Currency $to;

    public function from(Currency $cur): ConverterInterface
    {
        if ($cur->getValue()->isNegativeOrZero()) {
            throw new CurrencyValueException();
        }

        $this->from = $cur;
        return $this;
    }

    public function to(Currency $cur): ConverterInterface
    {
        if ($cur->getValue()->isNegativeOrZero()) {
            throw new CurrencyValueException();
        }

        $this->to = $cur;
        return $this;
    }

    public function amount(BigDecimal $amount): BigDecimal
    {
        $amountToUSD = $amount->dividedBy($this->from->getValue(), 5, RoundingMode::HALF_FLOOR);
        $USDtoNewAmount = $amountToUSD->multipliedBy($this->to->getValue(), 5, RoundingMode::HALF_FLOOR);
        return $USDtoNewAmount;
    }
}
