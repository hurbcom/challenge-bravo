<?php

declare(strict_types=1);

namespace App\Controller;

use App\Model\Currency;
use App\Repository\CurrencyRepositoryInterface;
use App\Service\Converter\ConverterInterface;
use Brick\Math\BigDecimal;
use League\Route\Http\Exception\NotFoundException;
use League\Route\Http\Exception\UnprocessableEntityException;
use Psr\Http\Message\ServerRequestInterface;

final class ConverterController
{
    public function __construct(
        protected CurrencyRepositoryInterface $currencyRepository,
        protected ConverterInterface $converter
    ) {}

    public function index(ServerRequestInterface $request): array
    {
        [$from, $to, $amount] = $this->parseInput($request->getQueryParams());

        $fromCurrency = $this->currencyRepository->get($from);
        $toCurrency = $this->currencyRepository->get($to);
        foreach ([$from => $fromCurrency, $to => $toCurrency] as $code => $currency) {
            if (empty($currency)) {
                throw new NotFoundException("$code currency not found");
            }
        }

        $convertedAmount = $this->converter
            ->from($fromCurrency)
            ->to($toCurrency)
            ->amount($amount);

        return ['amount' => $convertedAmount];
    }

    private function parseInput(array $input): array
    {
        $this->checkEmpty($input, 'from');
        $this->checkEmpty($input, 'to');
        $this->checkEmpty($input, 'amount');

        return [
            Currency::normalizeCode($input['from'] ?? null),
            Currency::normalizeCode($input['to'] ?? null),
            BigDecimal::of($input['amount']),
        ];
    }

    /**
     * Throws error on empty parameter
     *
     * @param array $input
     * @param string $var
     * @throws UnprocessableEntityException on empty parameter
     */
    private function checkEmpty(array $input, string $var): void
    {
        if (empty($input[$var])) {
            throw new UnprocessableEntityException("Empty parameter: [$var]");
        }
    }
}
