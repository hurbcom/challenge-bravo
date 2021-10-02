<?php

declare(strict_types=1);

namespace App\Service\CurrencyUpdater;

use App\Model\Currency;
use App\Repository\CurrencyRepositoryInterface;
use RuntimeException;

/**
 * Currency updater using OpenExangeRate API
 *
 * @link https://openexchangerates.org/
 */
class OpenExangeRatesUpdater implements CurrencyUpdaterInterface
{
    /**
     * @inheritDoc
     */
    public function getId(): string
    {
        return 'openexangerates';
    }

    /**
     * @inheritDoc
     */
    public function update(CurrencyRepositoryInterface $currencyRepository): void
    {
        $allUpdateableCurrencies = $currencyRepository->getBySource($this->getId());
        $updateableCodes = array_map(fn ($c) => $c->getCode(), $allUpdateableCurrencies);

        // Should update only available codes on our currency database
        $requiredCurrencies = array_filter(
            $this->fetchRates(),
            fn ($code) => in_array($code, $updateableCodes),
            ARRAY_FILTER_USE_KEY
        );

        /**
         * Map currency code and value based o USD to Currency Model
         *
         * @var $newCurrencies Currency[]
         */
        $newCurrencies = array_map(
            fn ($code, $amount) => Currency::create($code, $amount, $this->getId()),
            array_keys($requiredCurrencies),
            $requiredCurrencies
        );

        // $currencyRepository->setArray($newCurrencies);
        /**
         * @todo Replace set iteration with setArray
         *
         * This should be doing a batch update but sice its connecting to SQLite
         * it will not impact that much
         */
        foreach ($newCurrencies as $currency) {
            $currencyRepository->set($currency);
        }
    }

    private function fetchRates()
    {
        if (empty($_ENV['OPEN_EXANGE_RATE_KEY'])) {
            throw new RuntimeException('OpenExangeRate key is not set');
        }

        $key = $_ENV['OPEN_EXANGE_RATE_KEY'];

        $latest = file_get_contents(
            "https://openexchangerates.org/api/latest.json?app_id={$key}&show_alternative=1"
        );

        $response = json_decode($latest);

        if ($response->base !== 'USD') {
            throw new RuntimeException("Endpoint base currency is not USD");
        }

        return $response->rates;
    }
}
