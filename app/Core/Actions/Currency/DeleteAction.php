<?php

namespace App\Core\Actions\Currency;

use App\Core\Actions\BaseAction;
use App\Models\Currency;

class DeleteAction extends BaseAction
{
    /**
     * @return array
     */
    public function rules(): array
    {
        return [
            'code' => [
                'required',
                'exists:currencies,code'
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
     * @return mixed
     */
    public function execute()
    {
        $code = $this->get('code');

        Currency::where('code', strtoupper($code))->get()->first()->delete();

        return [];
    }
}