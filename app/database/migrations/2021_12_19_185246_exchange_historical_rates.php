<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ExchangeHistoricalRates extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create( 'exchange_historical_rates', function (Blueprint $table) {
            $table->string( 'code', 15 );
            $table->decimal( 'rate', 16, 6 );
            $table->date( 'historical' );
            $table->timestamps();
        } );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists( 'exchange_historical_rates' );
    }
}
