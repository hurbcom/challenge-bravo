<?php

declare(strict_types=1);

namespace App\Services;

use App\HttpClient\HttpClientsInterface;
use Illuminate\Support\Facades\Cache;

class ConvertAmountService
{
    protected $httpClient;

    public function __construct(HttpClientsInterface $httpClient)
    {
        $this->httpClient = $httpClient;
    }

    public function calculateValue(array $from, array $to, float $amount) : string
    {
        /**
         * Conversion between True Currencies - e.g USD to BRL
         */
        if ($from[1] === null && $to[1] === null) {
            $url = env('URL_API_CURRENCY') . "/{$from[0]}/{$to[0]}.json";

            try {
                $currencyRate    = $this->getCurrencyRate($url);
                $amountConverted = $currencyRate[$to[0]] * $amount;

                return number_format($amountConverted, 4, ',', '.');
            } catch (\Exception $e) {
                $error_msg = $e->getMessage();
                throw new \Exception($error_msg);
            }
        }

        /**
         * Conversion Between True and fictitious Currency - e.g. BRL to PSN
         */
        if ($from[1] === null && $to[1] !== null) {

            $url = env('URL_API_CURRENCY') . "/{$from[0]}/usd.json";

            try {
                $currencyRate = $this->getCurrencyRate($url);

                /**
                 * How to convert amount
                 * amount * usd_quotation * equivalent_value of to_currency
                 */
                $amountConverted = $amount * $currencyRate[$to[0]] * $to[1];

                return number_format($amountConverted, 4, ',', '.');
            } catch (\Exception $e) {
                $error_msg = $e->getMessage();
                throw new \Exception($error_msg);
            }
        }

        /**
         * Conversion between fictitious Currency and True Currency - e.g. PSN x BRL
         */
        if ($from[1] !== null && $to[1] === null) {
            $url = env('URL_API_CURRENCY') . "/usd/{$to[0]}.json";

            try {
                $currencyRate = $this->getCurrencyRate($url);

                /**
                 * How to convert amount
                 * amount * equivalent_value of from_currency * usd_quotation
                 */
                $amountConverted = $amount * $from[1] * $currencyRate[$to[0]];

                return number_format($amountConverted, 4, ',', '.');
            } catch (\Exception $e) {
                $error_msg = $e->getMessage();
                throw new \Exception($error_msg);
            }
        }

        /**
         * Conversion between fictitious Currencies - e.g. PSN to XBX
         */
        if ($from[1] !== null && $to[1] !== null) {
            $amountConverted = $amount * $from[1] / $to[1];
            return number_format($amountConverted, 4, ',', '.');
        }
    }

    /**
     * Get Currency Rate from external API or from Cache
     * Each cache expires in 60 seconds
     */
    protected function getCurrencyRate(string $url) : array
    {
        try{
            return Cache::remember($url, env('CACHE_LIFETIME'), function () use ($url) {
                return $this->httpClient->startHttpClient($url, 'GET');
            });
        } catch (\Exception $e) {
            $error_msg = $e->getMessage();
            throw new \Exception($error_msg);
        }
    }
}
