<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

/**
 * @OA\Schema(
 *      title="Validation Rules to convert currencies",
 *      description="Regras de Validação dos parâmetros que são informados no endpoint de conversão de moeda",
 *      type="object",
 *      required={"to", "from", "amount"}
 * )
 */
class ConvertRequest extends FormRequest
{
    /**
     * @OA\Property(
     *      title="from",
     *      description="Sigla da Moeda a ser convertida",
     *      example="HURB"
     * )
     *
     * @var string
     */
    public $from;

    /**
     * @OA\Property(
     *      title="to",
     *      description="Sigla da moeda após conversão.",
     *      example="USD"
     * )
     *
     * @var string
     */
    public $to;

    /**
     * @OA\Property(
     *      title="amount",
     *      description="Valor a ser convertido",
     *      example="200.70"
     * )
     *
     * @var float
     */
    public $amount;

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
            'to'     => ['required'],
            'from'   => ['required'],
            'amount' => ['required', 'numeric'],
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
