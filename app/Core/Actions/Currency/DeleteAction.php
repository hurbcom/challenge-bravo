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
            'id' => [
                'required',
                'uuid',
                'exists:currencies'
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
        Currency::find($this->get('id'))->delete();

        return [];
    }
}