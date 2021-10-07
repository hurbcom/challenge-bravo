<?php

declare(strict_types=1);

namespace App\Service\CurrencyUpdater;

use App\Logger\UpdaterLogger;
use App\Model\Currency;
use App\Repository\CurrencyRepositoryInterface;
use Brick\Math\BigDecimal;
use RuntimeException;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Contracts\Cache\ItemInterface;

/**
 * Currency updater using OpenExchangeRate API
 *
 * @link https://openexchangerates.org/
 */
class OpenExchangeRatesUpdater implements CurrencyUpdaterInterface
{
    public function __construct(
        private UpdaterLogger $logger,
        private FilesystemAdapter $cache
    ) {}

    /**
     * @inheritDoc
     */
    public static function getId(): string
    {
        return 'open-exchange-rates';
    }

    public function lookup(Currency $currency): ?BigDecimal
    {
        $rates = $this->getRates();
        try {
            return BigDecimal::of($rates[$currency->getCode()]);
        } catch (\Throwable $th) {
            return null;
        }
    }

    /**
     * @inheritDoc
     */
    public function update(CurrencyRepositoryInterface $currencyRepository): void
    {
        $allUpdateableCurrencies = $currencyRepository->getBySource(self::getId());
        $updateableCodes = array_map(fn ($c) => $c->getCode(), $allUpdateableCurrencies);

        // Should update only available codes on our currency database
        $requiredCurrencies = array_filter(
            $this->getRates(),
            fn ($code) => in_array($code, $updateableCodes),
            ARRAY_FILTER_USE_KEY
        );

        /**
         * Map currency code and value based o USD to Currency Model
         *
         * @var $newCurrencies Currency[]
         */
        $newCurrencies = array_map(
            fn ($code, $amount) => Currency::create($code, BigDecimal::of($amount), self::getId()),
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

    /**
     * Get cached rates
     *
     * @return array of rates
     */
    private function getRates()
    {
        return $this->cache->get(
            'open_exchange',
            fn (ItemInterface $i) => $this->fetchRates($i)
        );
    }

    private function fetchRates(ItemInterface $item)
    {
        $exp = filter_var($_SERVER['OPEN_EXCHANGE_CACHE_EXPIRATION_SECONDS'], FILTER_VALIDATE_INT);

        if (!is_integer($exp)) {
            throw new RuntimeException(
                "Environment variable [OPEN_EXCHANGE_CACHE_EXPIRATION_SECONDS] malformatted or missing."
            );
        }

        $item->expiresAfter($exp);

        if (empty($_SERVER['OPEN_EXCHANGE_RATE_KEY'])) {
            throw new RuntimeException('OpenExchangeRate key is not set');
        }

        $key = $_SERVER['OPEN_EXCHANGE_RATE_KEY'];

        $latest = file_get_contents(
            "https://openexchangerates.org/api/latest.json?app_id={$key}&show_alternative=1"
        );

        $this->logger->debug("OpenExangeRates response: " . $latest);
        $response = json_decode($latest);

        if ($response->base !== 'USD') {
            throw new RuntimeException("Endpoint base currency is not USD");
        }

        return (array) $response->rates;
    }
}
