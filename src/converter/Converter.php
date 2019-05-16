<?php

namespace Hurb\CurrencyConverter;

use Hurb\CurrencyConverter\Repositories\RepositoryInterface;

class Converter implements ConverterInterface
{
    /**
     * @var RepositoryInterface
     */
    private $repository;

    /**
     * @param RepositoryInterface $repository
     * @return void
     */
    public function __construct(RepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Apply the conversion between to currencies ($from and $to)
     *
     * @param string $from
     * @param string $to
     * @param float $amount
     * @return float
     */
    public function convert(string $from, string $to, float $amount) : float
    {
        $amount = $amount / $this->getUSDRate($from);
        $amount = $this->getUSDRate($to) * $amount;

        return round($amount, 2);
    }

    /**
     * Get the USD rate from a given currency
     *
     * @var string $currency
     * @return float
     */
    public function getUSDRate(string $currency) : float
    {
        $rate = $this->repository->get($currency);

        if (empty($rate)) {
            throw new CurrencyConverterException(3);
        }

        return (float) $rate;
    }
}
