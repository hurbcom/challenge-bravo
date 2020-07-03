<?php

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
        DB::table('currency')->insert([
            'name' => 'CAD'
        ]);

        DB::table('currency')->insert([
            'name' => 'HKD'
        ]);

        DB::table('currency')->insert([
            'name' => 'ISK'
        ]);

        DB::table('currency')->insert([
            'name' => 'PHP'
        ]);

        DB::table('currency')->insert([
            'name' => 'DKK'
        ]);

        DB::table('currency')->insert([
            'name' => 'HUF'
        ]);

        DB::table('currency')->insert([
            'name' => 'CZK'
        ]);

        DB::table('currency')->insert([
            'name' => 'GBP'
        ]);

        DB::table('currency')->insert([
            'name' => 'RON'
        ]);

        DB::table('currency')->insert([
            'name' => 'SEK'
        ]);

        DB::table('currency')->insert([
            'name' => 'IDR'
        ]);

        DB::table('currency')->insert([
            'name' => 'INR'
        ]);

        DB::table('currency')->insert([
            'name' => 'BRL'
        ]);

        DB::table('currency')->insert([
            'name' => 'RUB'
        ]);

        DB::table('currency')->insert([
            'name' => 'HRK'
        ]);

        DB::table('currency')->insert([
            'name' => 'JPY'
        ]);

        DB::table('currency')->insert([
            'name' => 'THB'
        ]);

        DB::table('currency')->insert([
            'name' => 'CHF'
        ]);

        DB::table('currency')->insert([
            'name' => 'EUR'
        ]);

        DB::table('currency')->insert([
            'name' => 'MYR'
        ]);

        DB::table('currency')->insert([
            'name' => 'BGN'
        ]);

        DB::table('currency')->insert([
            'name' => 'TRY'
        ]);

        DB::table('currency')->insert([
            'name' => 'CNY'
        ]);

        DB::table('currency')->insert([
            'name' => 'NOK'
        ]);

        DB::table('currency')->insert([
            'name' => 'NZD'
        ]);

        DB::table('currency')->insert([
            'name' => 'ZAR'
        ]);

        DB::table('currency')->insert([
            'name' => 'USD'
        ]);

        DB::table('currency')->insert([
            'name' => 'MXN'
        ]);

        DB::table('currency')->insert([
            'name' => 'SGD'
        ]);

        DB::table('currency')->insert([
            'name' => 'AUD'
        ]);

        DB::table('currency')->insert([
            'name' => 'ILS'
        ]);

        DB::table('currency')->insert([
            'name' => 'KRW'
        ]);

        DB::table('currency')->insert([
            'name' => 'PLN'
        ]);
    }
}
