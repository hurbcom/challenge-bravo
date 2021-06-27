<?php

namespace App\Http\Requests;

class CurrencyRequest implements RequestInterface
{
    public static function create(): array
    {
        return [
            'to' => ['required'],
            'from' => ['required'],
            'amount' => ['required', 'numeric'],
        ];
    }

    public static function update(): array
    {
        return [];
    }
}