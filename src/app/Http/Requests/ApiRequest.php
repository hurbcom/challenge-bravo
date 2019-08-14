<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\JsonResponse;

class ApiRequest extends FormRequest
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
     * @return array
     */
    public function rules()
    {
        return [
            'to' => 'required|in:USD,BRL,EUR,BTC,ETH',
            'from' => 'required|in:USD,BRL,EUR,BTC,ETH',
            'amount' => 'required|numeric',
        ];
    }

    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        $response = new JsonResponse([
            'data' => [],
            'meta' => [
                'message' => 'The given data is invalid',
                'errors' => $validator->errors()
            ]
        ], 422);

        throw new \Illuminate\Validation\ValidationException($validator, $response);
    }
}
