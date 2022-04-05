<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('currency')->insert(['code' => 'USD', 'price' => 0]);
        DB::table('currency')->insert(['code' => 'BRL', 'price' => 0]);
        DB::table('currency')->insert(['code' => 'EUR', 'price' => 0]);
        DB::table('currency')->insert(['code' => 'BTC', 'price' => 0]);
        DB::table('currency')->insert(['code' => 'ETH', 'price' => 0]);
    }
}
