<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHistoricoCotacaoTable extends Migration
{
    /** "code": "USD",
     * "codein": "BRL",
     *  "name": "Dólar Americano/Real Brasileiro",
     *  "high": "5.2192",
     *  "low": "5.1648",
     *  "varBid": "0.0021",
     *  "pctChange": "0.04",
     *  "bid": "5.168",
     *  "ask": "5.171",
     *  "timestamp": "1660942795",
     *  "create_date": "2022-08-19 17:59:55" 
     * */


    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('historico_cotacao', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("user_id");
            $table->string("code", 3);
            $table->string("codein", 3);
            $table->string("name", 100);
            $table->decimal("high", 8, 4);
            $table->decimal("low", 8, 4);
            $table->decimal("varBid", 8, 4);
            $table->decimal("pctChange", 8, 4);
            $table->decimal("bid", 8, 4);
            $table->decimal("ask", 8, 4);
            $table->timestamp("timestamp");
            $table->datetime("create_date");
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('historico_cotacao');
    }
}
