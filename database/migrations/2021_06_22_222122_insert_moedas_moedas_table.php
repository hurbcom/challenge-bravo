<?php

use App\Models\Models\Moeda;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

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
            ['nome' => 'USD', 'nome_exibicao' => 'Dólar Americano'],
            ['nome' => 'BRL', 'nome_exibicao' => 'Real'],
            ['nome' => 'EUR', 'nome_exibicao' => 'Euro'],
            ['nome' => 'BTC', 'nome_exibicao' => 'Bitcoin'],
            ['nome' => 'ETH', 'nome_exibicao' => 'Ethereum'],
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
