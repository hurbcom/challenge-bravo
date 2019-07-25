<?php

namespace Tests\Unit;

use App\Models\ConvertCurrency;
use Carbon\Carbon;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ConvertCurrencyTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testSave()
    {
        $model = new ConvertCurrency();
        $model->code = "ABC";
        $model->bid = 2;
        $model->create_date = Carbon::now();

        $this->assertTrue($model->save());
    }

    public function testFind()
    {
        factory(\App\Models\ConvertCurrency::class, 2)->create();
        $lista = \App\Models\ConvertCurrency::all();
        $this->assertTrue(count($lista) > 0);
    }
}
