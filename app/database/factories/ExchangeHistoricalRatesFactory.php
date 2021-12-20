<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ExchangeHistoricalRate;

class ExchangeHistoricalRatesFactory extends Factory
{
    /**
     * Define factory class
     * 
     * @var (object)
     * @access protected
     */
    protected $model = ExchangeHistoricalRate::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $sCode = $this->faker->currencyCode() . "-" . $this->faker->currencyCode();
        return [
            'code' => $sCode,
            'historical' => $this->faker->date( "Y-m-d", "now" ),
            'rate' => $this->faker->randomFloat( 6, 7, 16 )
        ];
    }
}
