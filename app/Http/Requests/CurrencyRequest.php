<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

/**
 * @OA\Schema(
 *      title="Validation Rules to Store new Currency",
 *      description="Regras de Validação dos parâmetros que são informados no cadastro de uma nova Moeda",
 *      type="object",
 *      required={"code_currency"}
 * )
 */
class CurrencyRequest extends FormRequest
{
    /**
     * @OA\Property(
     *      title="code_currency",
     *      description="Sigla da Moeda",
     *      example="HURB"
     * )
     *
     * @var string
     */
    public $code_currency;

    /**
     * @OA\Property(
     *      title="equivalent_value",
     *      description="Valor para relação entre a moeda fictícia e o dolar",
     *      example="1.25"
     * )
     *
     * @var float
     */
    public $equivalent_value;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize() : bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules() : array
    {
        return [
            'code_currency'    => ['required', 'min:3', 'max:5', 'unique:currencies'],
            'base_currency'    => ['nullable', 'min:3', 'max:5'],
            'equivalent_value' => ['nullable', 'numeric', 'regex:/^\d+(\.\d{1,6})?$/'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.*
     * @return array
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'errors' => $validator->errors()
        ], 422));
    }
}
