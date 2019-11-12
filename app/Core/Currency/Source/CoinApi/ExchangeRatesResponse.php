<?php

namespace App\Core\Currency\Source\CoinApi;

use App\Core\HttpClient\Response;
use Illuminate\Support\Arr;

class ExchangeRatesResponse extends Response
{
    /**
     * @return string
     */
    public function getErrorMessage(): string
    {
        return $this->getFieldData('error_code', 'ERR01');
    }

    /**
     * @return string
     */
    public function getErrorCode(): string
    {
        return $this->getFieldData('error_message', 'Error message default');
    }

    /**
     * @param string $code
     * @return float
     */
    public function getValue(string $code): float
    {
        $value = collect($this->getFieldData('rates'))
            ->first(function (array $data) use ($code) {
                return Arr::get($data, 'asset_id_quote') === $code;
            });

        return Arr::get($value, 'rate');
    }
}