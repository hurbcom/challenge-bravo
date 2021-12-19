<?php

namespace Database\Factories;
use App\Models\CurrencyCodes;

use Illuminate\Database\Eloquent\Factories\Factory;

class CurrencyCodesFactory extends Factory
{
    /**
     * Define factory class
     * 
     * @var (object)
     * @access protected
     */
    protected $model = CurrencyCodes::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'code' => $this->faker->currencyCode(),
            'default' => $this->faker->rand( 0, 1 ),
            'created_at' => now()
        ];
    }
}
