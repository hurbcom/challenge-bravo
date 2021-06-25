<?php

namespace App\Http\Requests;

class MoedaRequest implements RequestInterface
{
    public static function create(): array
    {
        return [
            'nome' => ['required', 'unique:moedas'],
        ];
    }

    public static function update(): array
    {
        return [];
    }
}