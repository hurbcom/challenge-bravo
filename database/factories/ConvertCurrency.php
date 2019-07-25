<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */
use App\Models\ConvertCurrency;
use Illuminate\Support\Str;
use Faker\Generator as Faker;


$factory->define(ConvertCurrency::class, function (Faker $faker) {
    return [
        'code' => Str::random(3),
        'bid' => rand(1,10),
        'create_date' => now(),
    ];
});
