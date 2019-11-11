<?php

namespace App\Core\Actions\Currency;

use App\Core\Actions\BaseAction;
use App\Core\Currency\Source\ExchangeRates\ExchangeRatesManager;
use App\Core\Rules\Currency\CurrencySupported;
use App\Models\Currency;
use Illuminate\Support\Collection;

class CreateAction extends BaseAction
{
    /**
     * @return array
     */
    public function rules(): array
    {
        return [
            'code' => [
                'required',
                'unique:currencies,code',
                new CurrencySupported(),
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
     * @return Collection
     */
    protected function listBySource(): Collection
    {
        return collect([
            ExchangeRatesManager::TYPE => ExchangeRatesManager::CURRENCIES
        ]);
    }

    /**
     * @param string $code
     * @return string
     */
    protected function findSource(string $code): string
    {
        return $this
            ->listBySource()
            ->filter(function (array $currencies) use ($code) {
                return in_array($code, $currencies);
            })
            ->keys()
            ->first();
    }

    /**
     * @return mixed
     */
    public function execute()
    {
        $source = $this->findSource($this->get('code'));

        Currency::create(array_merge($this->data, ['source' => $source]));

        return [];
    }
}
