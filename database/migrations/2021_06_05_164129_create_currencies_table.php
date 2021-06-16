<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCurrenciesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tb_currencies', function (Blueprint $table) {
            $table->id();
            $table->string("st_short_name", 3);
            $table->string("st_descrtption", 200);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        
        Schema::dropIfExists('tb_currencies', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
}
