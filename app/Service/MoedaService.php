<?php

namespace App\Service;

use App\Repositories\MoedaRepository;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class MoedaService
{
    protected string $baseUrl, $to, $from;
    protected float $amount;

    public function __construct(string $to, string $from, float $amount)
    {
        $this->baseUrl = env('URL_API_CURRENCY');
        $this->to = strtolower($to);
        $this->from = strtolower($from);
        $this->amount = $amount;
    }

    /**
     * Busca a cotação da moeda informada 
     */
    public function getQuotation(): array
    {
        $to = $this->getLastro($this->to);
        $from = $this->getLastro($this->from);
        
        $response = Http::get($this->baseUrl . sprintf('%s/%s.json', $to, $from));
        
        if ($response->clientError()) {
            throw new NotFoundHttpException('Moedas para cotação não encontradas');
        }
        
        Log::info('fez a busca na api', ['data' => $response->json()]);

        return [
            'data' => $this->formatDate($response['date']),
            'cotacao' => $response[$from],
        ];
    }

    /**
     * Devolve o valor da moeda convertido
     */
    public function getConversion(): array
    {
        // busca dados salvos no cache caso exista se não busca na api
        $quotation = Cache::remember($this->getCacheKey(), Carbon::now()->addHours(12), function () {
            return $this->getQuotation();
        });

        $convertedCurrency = $this->makeConversion(data_get($quotation, 'cotacao'), $this->amount);

        return [
            'valor_origem' => sprintf('%s %s', strtoupper($this->to), $this->formatValue($this->amount)),
            'valor_convertido' => sprintf('%s %s', strtoupper($this->from), $convertedCurrency),
        ];
    }

    /**
     * Faz a conversão com base na cotação da moeda buscada.
     */
    protected function makeConversion(float $quotation, float $amount): string
    {
        return $this->formatValue(($quotation * $amount));
    }

    /**
     * Cria nome para do cache salvar dados
     */
    public function getCacheKey(): string
    {
        return $this->to . '_to_' . $this->from;
    }

    /**
     * Traz o lastro da moeda caso ela seja fictícia
     */
    protected function getLastro(string $currency): string
    {
        $moeda = (new MoedaRepository())->findBy('nome', strtoupper($currency));

        if (is_null($moeda)) {
            throw new ModelNotFoundException('Moeda para conversão não encontrada');
        }

        if (!is_null($moeda->lastro)) {
            return strtolower($moeda->lastro);
        }
        return $currency;
    }

    /**
     * Formata data para o padrão brasileiro
     */
    protected function formatDate(string $date): string
    {
        return Carbon::create($date)->format('d/m/Y');
    }

    /**
     * Formata o valor para o padrão brasileiro
     */
    protected function formatValue($value): string
    {
        return number_format($value, 2, ',', '.');
    }
}
