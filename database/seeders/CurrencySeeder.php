<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CurrencySeeder extends Seeder
{
    private $initialCurrencies = [
        "USD" => "Dólar americano",
        "BRL" => "Real brasileiro",
        "EUR" => "Euro",
        "BTC" => "Bitcoin",
        "ETH" => "Ethereum",
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach($this->initialCurrencies as $currency => $descrption){
            DB::table('tb_currencies')->insert([
                'st_short_name' => $currency,
                'st_descrtption' => $descrption,
                'created_at' => Carbon::now(),
            ]);
        }
    }
}
