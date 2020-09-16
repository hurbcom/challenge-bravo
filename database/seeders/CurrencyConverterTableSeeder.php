<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CurrencyConverter;

class CurrencyConverterTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $defaultCurrencies = CurrencyConverter::DEFAULT_CURRENCIES_AND_VALUES;

        foreach ($defaultCurrencies as $currency => $value) {
            $newCurrency = new CurrencyConverter();
            $newCurrency->currency = $currency;
            $newCurrency->value = $value;
            $newCurrency->hasAutomaticUpdate = true;
            $newCurrency->save();
        }
    }
}
