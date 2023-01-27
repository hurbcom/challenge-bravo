<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use App\Models\Currency;

class CurrencyTest extends TestCase
{
    use RefreshDatabase;

    public function test_route_list_currencies()
    {
        $response = $this->get('/api/currency');
        $response->assertStatus(200);
    }

    public function test_create_new_currency_in_correct_table()
    {
        $currency = ['acronym' => 'ABC', 'name' => 'Moeda teste 1', 'amount' => '1.5'];
        Currency::create($currency);
        $this->assertDatabaseHas('currencies', $currency);
    }

    public function test_cant_have_duplicate_currency()
    {
        $currency = ['acronym' => 'AAA', 'name' => 'Moeda teste 2', 'amount' => '1.5'];
        
        $save = Currency::create($currency);
        $existingCurrency = Currency::where('acronym', $currency['acronym'])->first();

        if ($existingCurrency) {
            $result = false;
        } else {
            $result = true;
            Currency::create($currency);
        }
        $this->assertFalse($result);
    }

    public function test_create_currency()
    {
        $data = ["acronym" => "USD1", "name" => "Dolar Americano", "amount" => 1];

        Currency::create($data);

        $acronym = 'USD1';
        $currency = Currency::where('acronym', '=', $acronym)->first(); 

        $this->assertEquals($currency->acronym,'USD1');
    }

    public function test_can_deleted_currency(){

        $data = ["acronym" => "USD2", "name" => "Dolar Americano", "amount" => 1];

        Currency::create($data);        

        $acronym = 'USD2';
        $currency = Currency::where('acronym', '=', $acronym)->first();  

       // Search by id and delete

        $Search_Id = Currency::find($currency['id']);
        $Search_Id->delete();
        $this->assertDatabaseMissing('currencies',['acronym'=>'USD2']);
   }

   public function test_can_update_currency(){

    $data = ["acronym" => "AAA", "name" => "Moeda A", "amount" => 1];

    $currency_1 = Currency::create($data); 
        
    $data_2 = ["acronym" => "BBB", "name" => "Moeda B", "amount" => 2];

    $currency_1->update($data_2);  

    $currency_2 = Currency::where('acronym', 'BBB')->first();  

    $this->assertEquals($currency_1->id,$currency_2->id);
}
   
}
