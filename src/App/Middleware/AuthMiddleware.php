<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Exception\NotAuthorized;
use LosMiddleware\ApiServer\Exception\AuthorizationException;
use LosMiddleware\ApiServer\Exception\RuntimeException;
use Mezzio\ProblemDetails\ProblemDetailsResponseFactory;
use Mezzio\Router\RouteResult;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Ramsey\Uuid\Uuid;

use function array_key_exists;
use function assert;
use function in_array;

class AuthMiddleware implements MiddlewareInterface
{
    private array $apiKeys;
    private array $openRoutes;
    private ProblemDetailsResponseFactory $problemDetailsResponseFactory;

    public function __construct(
        array $apiKeys,
        array $openRoutes,
        ProblemDetailsResponseFactory $problemDetailsResponseFactory
    ) {
        $this->apiKeys                       = $apiKeys;
        $this->openRoutes                    = $openRoutes;
        $this->problemDetailsResponseFactory = $problemDetailsResponseFactory;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        try {
            $this->validate($request);
        } catch (RuntimeException $ex) {
            return $this->problemDetailsResponseFactory->createResponseFromThrowable($request, $ex);
        }

        return $handler->handle($request);
    }

    private function validate(ServerRequestInterface $request): void
    {
        $route = $request->getAttribute(RouteResult::class);
        assert($route instanceof RouteResult);

        $routeName  = $route->getMatchedRouteName();
        $httpMethod = $request->getMethod();

        if (empty($routeName)) {
            return;
        }

        if (in_array($routeName, $this->openRoutes, true)) {
            return;
        }

        if (! $request->hasHeader('x-api-key')) {
            throw AuthorizationException::create('Missing Authorization header');
        }

        $key = $request->getHeader('x-api-key')[0];

        if (! Uuid::isValid($key) || ! array_key_exists($key, $this->apiKeys)) {
            throw AuthorizationException::create('Unknown api key');
        }

        if (
            ($this->apiKeys[$key]['allowed-routes'][0] ?? '') !== '*'
            && ! in_array($httpMethod, $this->apiKeys[$key]['allowed-routes'][$routeName] ?? [], true)
        ) {
            throw NotAuthorized::create('Endpoint not allowed');
        }
    }
}
