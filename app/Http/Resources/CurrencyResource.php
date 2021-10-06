<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CurrencyResource extends JsonResource
{
    public function toArray($request) : array
    {
        return [
            'id'                => $this->id,
            'codeCurrency'      => $this->code_currency,
            'baseCurrency'      => $this->base_currency,
            'equivalent_value'  => $this->equivalent_value,
        ];
    }
}
