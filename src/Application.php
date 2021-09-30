<?php

declare(strict_types=1);

namespace App;

use Laminas\Diactoros\ResponseFactory;
use Laminas\Diactoros\ServerRequestFactory;
use Laminas\HttpHandlerRunner\Emitter\SapiEmitter;
use League\Route\Router;
use League\Route\Strategy\JsonStrategy;

class Application
{
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
        $strategy = new JsonStrategy(new ResponseFactory());
        $router = new Router();
        $router->setStrategy($strategy);

        // setup routes
        require __DIR__ . '/routes.php';
        $response = $router->dispatch($request);

        // send the response to the browser
        $emitter = new SapiEmitter();
        $emitter->emit($response);
    }
}
