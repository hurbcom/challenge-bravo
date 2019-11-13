<?php

use App\Core\Currency\Source\CoinApi\CoinApiManager;
use App\Core\Currency\Source\ExchangeRates\ExchangeRatesManager;
use App\Models\Currency;
use Illuminate\Database\Seeder;

class DefaultCurrencies extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        collect([
            [
                'code' => 'BRL',
                'source' => ExchangeRatesManager::TYPE
            ],
            [
                'code' => 'USD',
                'source' => ExchangeRatesManager::TYPE
            ],
            [
                'code' => 'EUR',
                'source' => ExchangeRatesManager::TYPE
            ],
            [
                'code' => 'BTC',
                'source' => CoinApiManager::TYPE
            ],
            [
                'code' => 'ETH',
                'source' => CoinApiManager::TYPE
            ]
        ])->each(function (array $data) {
            Currency::create($data);
        });
    }
}
