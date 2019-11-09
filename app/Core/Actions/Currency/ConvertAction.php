<?php

namespace App\Core\Actions\Currency;

use App\Core\Actions\BaseAction;
use App\Models\Currency;

class ConvertAction extends BaseAction
{
    /**
     * @return array
     */
    public function rules(): array
    {
        return [
            'from' => [
                'required'
            ],
            'to' => [
                'required'
            ],
            'amount' => [
                'required',
                'numeric'
            ]
        ];
    }

    /**
     * @return array
     */
    public function messages(): array
    {
        return [];
    }

    /**
     * @param string $code
     * @return Currency
     */
    private function findCurrency(string $code): Currency
    {
        return Currency::findByCode($code);
    }

    /**
     * @return mixed
     */
    public function execute()
    {
        $amount = $this->get('amount');
        $from = $this->get('from');
        $to = $this->get('to');

        $base = $this
            ->findCurrency($from)
            ->toBase($amount);

        $convertedAmount = $this
            ->findCurrency($to)
            ->convert($base);

        return [
            'converted_amount' => round($convertedAmount, 2)
        ];
    }
}