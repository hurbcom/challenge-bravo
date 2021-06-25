<?php

use App\Models\Moeda;
use Illuminate\Database\Migrations\Migration;

class InsertMoedasMoedasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $moedas = [
            ['nome' => 'USD'],
            ['nome' => 'BRL'],
            ['nome' => 'EUR'],
            ['nome' => 'BTC'],
            ['nome' => 'ETH'],
        ];

        foreach ($moedas as $moeda) {
            Moeda::create($moeda);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
