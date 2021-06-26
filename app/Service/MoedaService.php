<?php

namespace App\Service;

use App\Repositories\MoedaRepository;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MoedaService
{
    protected string $baseUrl;
    protected $repository;
    protected $to, $from;

    public function __construct(string $to, string $from)
    {
        $this->baseUrl = env('URL_API_CURRENCY');
        $this->repository = new MoedaRepository();
        $this->to = $to;
        $this->from = $from;
    }

    protected function getFrom(): string
    {
        return Str::lower($this->from);
    }

    protected function getQuotation()
    {        
        if (Cache::get($this->getCacheKey())) {
            Log::info('usou dados do cache.');
            
            return Cache::get($this->getCacheKey());
        }
        
        $request = sprintf('%s/%s.json', Str::lower($this->getLastro($this->to)), $this->getFrom());
        $response = Http::get($this->baseUrl . $request);
        
        Cache::put($this->getCacheKey(), $response->collect(), Carbon::now()->addHours(12));
        Log::info('usou dados da api');

        return $response->collect();
    }

    public function getCacheKey(): string
    {
        return Str::lower($this->getLastro($this->to)).'_to_'.$this->getFrom();
    }

    protected function getLastro(string $currency): string
    {
        $moeda = $this->repository->findBy('nome', Str::upper($currency));

        if (is_null($moeda)) {
            throw new ModelNotFoundException('Moeda para conversão não encontrada');
        }
        
        if (!is_null($moeda->lastro)) {
            return $moeda->lastro;
        }
        return $currency;
    }
    
    protected function makeConversion(string $quotation, string $amount): string
    {
        return number_format($quotation * $amount, 2, ',', '.');
    }

    protected function formatDate(string $date): string
    {
        return Carbon::create($date)->format('d/m/Y');
    }

    public function getConversion(float $amount): array
    {
        $quotation = $this->getQuotation();
        $fromValue = sprintf('%s %s', Str::upper($this->to), number_format($amount, 2, ',', '.'));
        $convertedAmout = $this->makeConversion($quotation->get($this->getFrom()), $amount);
        
        return [
            'quotation_date' => $this->formatDate($quotation->get('date')),
            'quotation_value' => $quotation->get($this->getFrom()),
            'from' => $fromValue,
            'converted_amount' => sprintf('%s %s', $this->from, $convertedAmout),
        ];
    }

}