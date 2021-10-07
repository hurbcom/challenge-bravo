<?php

declare(strict_types=1);

namespace App\Controller;

use App\Model\Currency;
use App\Repository\CurrencyRepositoryInterface;
use App\Service\CurrencyUpdater\OpenExchangeRatesUpdater;
use Brick\Math\BigDecimal;
use Exception;
use Laminas\Diactoros\Response\JsonResponse;
use League\Route\Http\Exception\NotFoundException;
use League\Route\Http\Exception\UnprocessableEntityException;
use PDOException;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ServerRequestInterface;

class CurrencyController
{
    public function __construct(
        protected ResponseFactoryInterface $responseFactory,
        protected CurrencyRepositoryInterface $currencyRepository
    ) {}

    public function list(ServerRequestInterface $request, $args): array
    {
        // Map each currency ($x) to array
        return array_map(
            fn ($x) => $x->toArray(),
            $this->currencyRepository->getAll()
        );
    }

    public function get(ServerRequestInterface $request, $args): array
    {
        $code = Currency::normalizeCode($args['code']);
        $currency = $this->currencyRepository->get($code);

        if (!$currency) {
            throw new NotFoundException();
        }

        return $currency->toArray();
    }

    public function set(ServerRequestInterface $request, $args): array
    {
        $code = Currency::normalizeCode($args['code']);
        $input = json_decode((string) $request->getBody(), true);

        $filledAmount = !empty($input['amount']);
        $filledSource = !empty($input['source']);

        // Note: Assign operator has precedence over xor, don't remove parentesis
        $filledOnlyAmountOrSource = ($filledAmount xor $filledSource);

        if (!$filledOnlyAmountOrSource) {
            $parametersCount = (int) $filledAmount + (int) $filledSource;
            throw new UnprocessableEntityException(
                "Parameters amount or source must be present. {$parametersCount} of them found."
            );
        }

        $currency = $this->currencyRepository->get($code) ?? Currency::create($code);

        if ($filledAmount) {
            $value = BigDecimal::of($input['amount']);
            $currency->setValue($value);
            $currency->setSource(Currency::STATIC_SOURCE_ID);
        }

        if ($filledSource) {
            $oerId = OpenExchangeRatesUpdater::getId();

            if ($input['source'] === $oerId) {
                $currency->setValue(BigDecimal::zero());
                $currency->setSource($oerId);
            } else {
                throw new UnprocessableEntityException("Source not compatible.");
            }
        }

        try {
            $this->currencyRepository->set($currency);
        } catch (PDOException $pe) {
            throw new Exception("Internal Server Error: Storage error ({$pe->getMessage()})", 0, $pe);
        }

        return $currency->toArray();
    }

    public function delete(ServerRequestInterface $request, $args)
    {
        $code = Currency::normalizeCode($args['code']);
        $deleted = $this->currencyRepository->delete($code);

        if (!$deleted) {
            throw new NotFoundException();
        }

        return new JsonResponse(null, 204);
    }
}
