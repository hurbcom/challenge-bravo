<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CurrencyApiGateway;

class CurrencyConverterTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $currencyApiGateway = new CurrencyApiGateway();
    
        $apiData = $currencyApiGateway->getApiVaules(CurrencyApiGateway::DEFAULT_CURRENCIES);
        $hasAutomaticUpdate = true;

        if (!$apiData) {
            $apiData = CurrencyApiGateway::DEFAULT_CURRENCIES_AND_VALUES;
            $hasAutomaticUpdate = false;
        }

        $currencyApiGateway->insertApiData($apiData, $hasAutomaticUpdate);
    }
}
