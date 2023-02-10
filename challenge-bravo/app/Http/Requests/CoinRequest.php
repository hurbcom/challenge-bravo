<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CoinRequest extends FormRequest
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
            'name'     => 'required|size:100',
            'code'   => 'required|size:3|alpha',
            'dolarValue' => 'required|numeric|between:0,999999999999.99'
        ];
    }
}
