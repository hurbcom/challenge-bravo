<?php

declare(strict_types=1);

use App\Middleware\AuthMiddleware;
use App\Middleware\NewRelicMiddleware;
use App\Middleware\SetupTranslatorMiddleware;
use App\Middleware\VersionMiddleware;
use Laminas\Stratigility\Middleware\ErrorHandler;
use LosMiddleware\ResponseTime\ResponseTime;
use Mezzio\Application;
use Mezzio\Handler\NotFoundHandler;
use Mezzio\Helper\BodyParams\BodyParamsMiddleware;
use Mezzio\Helper\ServerUrlMiddleware;
use Mezzio\Helper\UrlHelperMiddleware;
use Mezzio\MiddlewareFactory;
use Mezzio\ProblemDetails\ProblemDetailsMiddleware;
use Mezzio\ProblemDetails\ProblemDetailsNotFoundHandler;
use Mezzio\Router\Middleware\DispatchMiddleware;
use Mezzio\Router\Middleware\ImplicitHeadMiddleware;
use Mezzio\Router\Middleware\MethodNotAllowedMiddleware;
use Mezzio\Router\Middleware\RouteMiddleware;
use Psr\Container\ContainerInterface;
use Tuupola\Middleware\CorsMiddleware;

/**
 * Setup middleware pipeline:
 */
return static function (Application $app, MiddlewareFactory $factory, ContainerInterface $container): void {
    $app->pipe(ErrorHandler::class);
    $app->pipe(ServerUrlMiddleware::class);
    $app->pipe(BodyParamsMiddleware::class);
    $app->pipe(ProblemDetailsMiddleware::class);

    $app->pipe(ResponseTime::class);

    $app->pipe(VersionMiddleware::class);
    $app->pipe(RouteMiddleware::class);

    $app->pipe(ImplicitHeadMiddleware::class);
    $app->pipe(CorsMiddleware::class);
    $app->pipe(MethodNotAllowedMiddleware::class);

    $app->pipe(UrlHelperMiddleware::class);

    $app->pipe(NewRelicMiddleware::class);
    $app->pipe(AuthMiddleware::class);
    $app->pipe(SetupTranslatorMiddleware::class);

    $app->pipe(DispatchMiddleware::class);

    $app->pipe(ProblemDetailsNotFoundHandler::class);
    $app->pipe(NotFoundHandler::class);
};
