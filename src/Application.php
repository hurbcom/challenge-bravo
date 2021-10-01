<?php

declare(strict_types=1);

namespace App;

use DI\Container;
use Laminas\Diactoros\ResponseFactory;
use Laminas\Diactoros\ServerRequestFactory;
use Laminas\HttpHandlerRunner\Emitter\SapiEmitter;
use League\Route\Router;
use League\Route\Strategy\JsonStrategy;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;

class Application
{
    // Use getContainer
    private ?ContainerInterface $container;

    /**
     * Runs application's web entrypoint
     * dealing with reading HTTP's request to
     * routing and emitting response
     *
     * @return void
     */
    public function runWeb(): void
    {
        // setup router
        $request = ServerRequestFactory::fromGlobals();

        // resolve request route
        $response = $this->dispatch($request);

        // emit response
        $this->emit($response);
    }

    /**
     * Dispatch request and return response instance
     *
     * @param RequestInterface $request
     * @return ResponseInterface
     */
    protected function dispatch(RequestInterface $request): ResponseInterface
    {
        $strategy = new JsonStrategy(new ResponseFactory());
        $strategy->setContainer($this->getContainer());

        $router = new Router();

        // setup routes
        require __DIR__ . '/routes.php';

        $router->setStrategy($strategy);
        $response = $router->dispatch($request);

        return $response;
    }

    /**
     * Sends the response to the browser
     *
     * @param ResponseInterface $response
     * @return void
     */
    protected function emit(ResponseInterface $response): void
    {
        $emitter = new SapiEmitter();
        $emitter->emit($response);
    }

    /**
     * Return a dependency injection container instance
     *
     * @return ContainerInterface
     */
    protected function getContainer(): ContainerInterface
    {
        return $this->container ??= new Container();
    }
}
