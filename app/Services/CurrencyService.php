<?php

declare(strict_types=1);

namespace App\Services;

use App\HttpClient\HttpClientsInterface;
use App\Models\Currency;
use App\Repositories\Contracts\CurrencyRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Cache;

class CurrencyService
{
    protected $currencyRepository;
    protected $convertAmountService;
    protected $httpClient;

    public function __construct(
        CurrencyRepositoryInterface $currencyRepository,
        ConvertAmountService $convertAmountService,
        HttpClientsInterface $httpClient
    )
    {
        $this->httpClient           = $httpClient;
        $this->currencyRepository   = $currencyRepository;
        $this->convertAmountService = $convertAmountService;
    }

    public function showCurrency(int $id) : Currency
    {
        $currency = $this->currencyRepository->findById($id);
        if (!$currency) {
            throw new ModelNotFoundException('Currency Not Found.');
        }

        return $currency;
    }

    public function getCurrencies() : LengthAwarePaginator
    {
        return $this->currencyRepository->paginate();
    }

    public function storeNewCurrency(array $request)
    {
        $allCurrencies = $this->getAllCurrencies();
        $code = array_key_exists(strtolower($request['code_currency']), $allCurrencies);

        /**
         * All fictitious currencies should have equivalent_value
         */
        if (!$code && !isset($request['equivalent_value'])) {
            throw new \Exception('For fictitious Currency you should fill equivalent_value field.');
        }

        /**
         * All fictitious currencies should have USD as baseCurrency(lastro)
         */
        if (isset($request['equivalent_value']) && !$code) {
            $request['base_currency'] = 'usd';
        }

        /**
         * True currencies have no base_currency and no equivalent_value
         */
        if ($code) {
            $request['equivalent_value'] = null;
        }
        return $this->currencyRepository->store($request);
    }

    public function destroyCurrency(int $id) : bool
    {
        $currency = $this->currencyRepository->findById($id);
        $usd = $currency->code_currency ?? '';

        if ($usd === 'usd') {
            throw new \Exception('Not allowed to delete USD currency.');
        }

        return $this->currencyRepository->delete($id);
    }

    public function convertAmount(array $request) : string
    {
        $to     = $this->getBaseCurrency(strtolower($request['to']));
        $from   = $this->getBaseCurrency(strtolower($request['from']));
        $amount = (float)$request['amount'];

        /**
         * Currency is not in database
         */
        if (empty($from) || empty($to)) {
            return '';
        }

        try {
            return $this->convertAmountService->calculateValue($from, $to, $amount);
        } catch (\Exception $e) {
            $error_msg = $e->getMessage();
            throw new \Exception($error_msg);
        }
    }

    /**
     * baseCurrency means "Lastro"
     * return [baseCurrency, equivalent_value]
     * From fictitious currencies, USD willl always be the baseCurrency
     */
    protected function getBaseCurrency(string $convertTo) : array
    {
        $result = $this->currencyRepository->findWhereFirst('code_currency', $convertTo);

        if ($result) {
             $base_currency = $result['base_currency'] ?? $result['code_currency'];

             return [$base_currency, $result['equivalent_value']];
        }

        return [];
    }

    /**
     * Get all currencies fom public api
     */
    protected function getAllCurrencies() : array
    {
        $url = env('URL_API_CURRENCY') . ".json";
        try{
            return Cache::remember($url, env('CACHE_LIFETIME_1_DAY'), function () use ($url) {
                return $this->httpClient->startHttpClient($url, 'GET');
            });
        } catch (\Exception $e) {
            $error_msg = $e->getMessage();
            throw new \Exception($error_msg);
        }
    }
}
