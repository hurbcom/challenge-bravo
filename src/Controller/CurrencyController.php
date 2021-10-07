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
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ServerRequestInterface;

class CurrencyController
{
    private const SUPPORTED_UPDATERS = [
        'open-exchange-rates' => OpenExchangeRatesUpdater::class
    ];

    public function __construct(
        protected ResponseFactoryInterface $responseFactory,
        protected CurrencyRepositoryInterface $currencyRepository,
        protected ContainerInterface $container
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
            $value = $this->getValueFromSource($input['source'], $currency);
            $currency->setValue($value);
            $currency->setSource($input['source']);
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

    /**
     * Make a lookup on source to find the actual currency value
     *
     * @param string $source
     * @param Currency $currency
     * @return BigDecimal
     */
    private function getValueFromSource($source, Currency $currency): BigDecimal
    {
        $updater = self::SUPPORTED_UPDATERS[$source] ?? null;

        if (empty($updater)) {
            throw new UnprocessableEntityException("Source not found.");
        }

        $value = $this->container->get($updater)->lookup($currency);
        if (empty($value)) {
            throw new UnprocessableEntityException("Source not compatible with currency.");
        }

        return $value;
    }
}
