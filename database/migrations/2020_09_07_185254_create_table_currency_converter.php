<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableCurrencyConverter extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('currency_converter', function (Blueprint $table) {
            $table->increments('id');
            $table->string('currency')->unique()->index('currency');
            $table->double('value', 16, 8);
            $table->boolean('hasAutomaticUpdate')->nullable()->index('hasAutomaticUpdate');
            $table->timestamps();
        });

        Artisan::call('db:seed', [
            '--class' => CurrencyConverterTableSeeder::class
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('currency_converter');
    }
}
