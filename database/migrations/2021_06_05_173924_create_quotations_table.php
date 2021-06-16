<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuotationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tb_quotations', function (Blueprint $table) {
            $table->id();
            $table->integer("currency_id");
            $table->date("dt_quotation");
            $table->decimal("value", 30, 25);
            $table->string("st_lastro")->default("USD");
            $table->boolean("fictional")->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign("currency_id")->references("id")->on("tb_currencies");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tb_quotations', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
}
