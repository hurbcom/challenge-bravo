<?php

namespace App\Service;

use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class MoedaService
{
    protected string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = env('URL_API_CURRENCY');
    }

    public function getQuotation(string $to, string $from)
    {
        $request = sprintf('%s/%s.json', Str::lower($to), Str::lower($from));
        $response = Http::get($this->baseUrl . $request);
        
        return $response->collect();
    }

    public function conversion(string $to, string $from, float $amount): array
    {
        $quotation = $this->getQuotation($to, $from);
        $convertedAmount = $quotation->get($from) * $amount;
        $date = Carbon::create($quotation->get('date'))->format('d/m/Y');

        return [
            'quotation_date' => $date,
            'quotation_value' => $quotation->get($from),
            'from' => sprintf('%s %s', Str::upper($to), number_format($amount, 2, ',', '.')),
            'converted_amount' => sprintf('%s %s', Str::upper($from), number_format($convertedAmount, 2, ',', '.')),
        ];
    }
}