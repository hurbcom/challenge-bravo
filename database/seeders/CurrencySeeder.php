<?php

namespace Database\Seeders;

use App\Models\Currency;
use Illuminate\Database\Seeder;

class CurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $codeCurrencies = ['usd', 'brl', 'eur', 'btc', 'eth'];

        foreach ($codeCurrencies as $codeCurrency) {
            Currency::create([
                'code_currency' => $codeCurrency
            ]);
        }
    }
}
