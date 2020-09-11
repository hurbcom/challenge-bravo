<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\CurrencyConverter;

class CurrencyConverterTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $filename = env('SEED_JSON_FILENAME', 'defaultSeed');
        $path = storage_path() . "/json/${filename}.json";
        $dataArray = json_decode(file_get_contents($path), true);

        foreach ($dataArray['rates'] as $currency => $value) {
            CurrencyConverter::updateOrCreate(['currency' => $currency, 'value' => $value]);
        }
    }
}
