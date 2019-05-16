<?php

namespace Hurb\CurrencyConverter;

interface ConverterInterface
{
    /**
     * Apply the conversion between to currencies ($from and $to)
     *
     * @param string $from
     * @param string $to
     * @param float $amount
     * @return float
     */
    public function convert(string $from, string $to, float $amount) : float;
}
