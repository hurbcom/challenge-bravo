<?php

namespace App\Service;

use App\Repositories\MoedaRepository;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

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

    /**
     * Formata nome da moeda de origem para busca na api
     */
    protected function getFrom(): string
    {
        return Str::lower($this->from);
    }

    /**
     * Realiza a busca da cotação na api
     */
    protected function getQuotation()
    {
        if (Cache::get($this->getCacheKey())) {
            Log::info('usou dados do cache.');

            return Cache::get($this->getCacheKey());
        }

        $request = sprintf('%s/%s.json', Str::lower($this->getLastro($this->to)), $this->getFrom());
        $response = Http::get($this->baseUrl . $request);
        
        if ($response->clientError()) {
            throw new NotFoundHttpException('Moedas para cotação não encontradas');
        }
        
        Cache::put($this->getCacheKey(), $response->collect(), Carbon::now()->addHours(12));
        Log::info('usou dados da api');

        return $response->collect();
    }

    /**
     * Cria nome para do cache salvar dados
     */
    public function getCacheKey(): string
    {
        return $this->to . '_to_' . $this->from;
    }

    /**
     * Traz o nome da moeda caso possua moeda de lastro vinculada
     */
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

    /**
     * Faz a conversão com base na cotação da moeda buscada.
     */
    protected function makeConversion(string $quotation, string $amount): string
    {
        return ($quotation * $amount);
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

    /**
     * Devolve os dados referentes a conversão da moeda buscada
     */
    public function getConversion(float $amount): array
    {
        $quotation = $this->getQuotation();
        $convertedAmout = $this->makeConversion($quotation->get($this->getFrom()), $amount);

        return [
            'data_cotacao' => $this->formatDate($quotation->get('date')),
            'valor_cotacao' => $this->formatValue($quotation->get($this->getFrom())),
            'valor_origem' => sprintf('%s %s', Str::upper($this->to), $this->formatValue($amount)),
            'valor_convertido' => sprintf('%s %s', $this->getFrom(), $this->formatValue($convertedAmout)),
        ];
    }
}
