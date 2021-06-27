<?php

namespace App\Http\Requests;

class CurrencyRequest
{
    public static function conversion(): array
    {
        return [
            'to' => ['required'],
            'from' => ['required'],
            'amount' => ['required', 'numeric'],
        ];
    }
}