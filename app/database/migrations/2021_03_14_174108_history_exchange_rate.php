<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class HistoryExchangeRate extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Create table to store historical exchange rate information
        Schema::create( 'exchange_rate_historicals', function (Blueprint $table) {
            $table->string( 'code', 7 );
            $table->decimal( 'rate', 8, 2 );
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
        // Drop table if exists
        Schema::dropIfExists( 'exchange_rate_historicals' );
    }

}