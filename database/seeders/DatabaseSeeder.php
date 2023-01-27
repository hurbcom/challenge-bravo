<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    static $currencies = [
        [
            "acronym" => "USD",
            "name" => "Dolar Americano",
            "amount" => 1
        ],
        [
            "acronym" => "BRL",
            "name" => "Real",
            "amount" => 5.18
        ],
        [
            "acronym" => "EUR",
            "name" => "Euro",
            "amount" => 0.92
        ],
        [
            "acronym" => "BTC",
            "name" => "Bitcoin",
            "amount" => 5.18
        ],
        [
            "acronym" => "ETH",
            "name" => "Ethereum",
            "amount" => 0.00062
        ]
    ];

    public function run()
    {
        foreach (self::$currencies as $currency) {
            DB::table('currencies')->insert([
                'acronym' => $currency['acronym'],
                'name' => $currency['name'],
                'amount' => $currency['amount'],
                'fake' => 1,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' =>  date('Y-m-d H:i:s')
            ]);
        }
    }
}
