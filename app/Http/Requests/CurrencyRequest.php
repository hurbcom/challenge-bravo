<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CurrencyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'acronym'=>'required|string|max:10',
            'name'=>'required|string',
            'amount'=>'required|min:0|numeric'
        ];
    }

    public function messages()
    {
        return [
            'acronym.required' => 'O campo acronym é obrigatório (Ex: GTA$)',
            'acronym.string' => 'O campo acronym deve ser uma string',
            'acronym.max' => 'O campo acronym deve ter no máximo 10 caracteres',

            'name.required' => 'O campo name é obrigatório',
            'name.string' => 'O campo name deve ser uma string',

            'amount.required' => 'O campo amount é obrigatório',
            'amount.min' => 'O campo amount não pode ser negativo',
            'amount.numeric' => 'O campo amount deve ser numérico',
        ];
    }

}
