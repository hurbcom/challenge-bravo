<?php

declare(strict_types=1);

namespace App\Handler;

use App\Exception\InvalidCurrencies;
use App\Service\ExchangeService;
use Laminas\Diactoros\Response\JsonResponse;
use Mezzio\ProblemDetails\ProblemDetailsResponseFactory;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Throwable;

use function floatval;
use function sprintf;

class ExchangeHandler implements RequestHandlerInterface
{
    use FilterInputQuery;

    private ExchangeService $exchangeService;
    private ProblemDetailsResponseFactory $problemDetailsResponseFactory;

    public function __construct(
        ExchangeService $exchangeService,
        ProblemDetailsResponseFactory $problemDetailsResponseFactory
    ) {
        $this->exchangeService               = $exchangeService;
        $this->problemDetailsResponseFactory = $problemDetailsResponseFactory;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $from   = $this->filterString($request->getAttribute('from'));
        $to     = $this->filterString($request->getAttribute('to'));
        $amount = floatval($request->getAttribute('amount'));

        if (empty($amount) || empty($from) || empty($to)) {
            return $this->problemDetailsResponseFactory->createResponse(
                $request,
                400,
                'Invalid parameters'
            );
        }

        try {
            $result = $this->exchangeService->exchange($from, $to, $amount);
        } catch (InvalidCurrencies $exception) {
            return $this->problemDetailsResponseFactory->createResponseFromThrowable($request, $exception);
        } catch (Throwable $exception) {
            return $this->problemDetailsResponseFactory->createResponse(
                $request,
                400,
                'Ops! Something went wrong!'
            );
        }

        return new JsonResponse([
            'from' => $from,
            'to' => $to,
            'from_amount' => $amount,
            'to_amount' => sprintf('%.8f', $result),
        ]);
    }
}
