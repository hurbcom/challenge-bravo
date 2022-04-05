<?php
namespace App\Enums;

class CurrencyEnum
{
    CONST BACKING_CURRENCY = 'USD';
    CONST BACKING_CURRENCY_PRICE = 1;

    public static function getValidateMessages()
    {
        return [
            'code.required' => 'Currency code is required.',
            'code.unique' => 'Already existing this currency code',
            'price.required' => 'Currency price is required.',
            'price.regex' => 'Currency price must be in money format.',
            'to.required' => 'Origin currency code(to) is required.',
            'to.string' => 'Origin currency code(to) should be string.',
            'from.required' => 'Conversion currency(from) code is required.',
            'from.string' => 'Conversion currency code(from) should be string',
            'amount.required' => 'Amount is required.',
            'amount.numeric' => 'Amount should be numeric',
        ];
    }

    public static function getStoreValidateRules(String $onlyRule = null)
    {
        $rules = [
            'code' => 'required|max:10|unique:currency,code',
            'price' => 'required|regex:/^\d{1,10}(\.\d{1,2})?$/',
        ];

        if(!is_null($onlyRule)){
            return [$onlyRule => $rules[$onlyRule]];
        }

        return $rules;
    }

    public static function getConvertValidateRules()
    {
        return [
            'to' => 'required|string',
            'from' => 'required|string',
            'amount' => 'required|numeric',
        ];
    }
}
