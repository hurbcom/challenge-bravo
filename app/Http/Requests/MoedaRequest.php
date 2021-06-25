<?php

namespace App\Http\Requests;

class MoedaRequest implements RequestInterface
{
    public static function rules(): array
    {
        return [
            'nome' => ['required', 'unique:moedas'],
        ];
    }
}