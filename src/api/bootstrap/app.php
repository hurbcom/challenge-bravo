<?php

require_once __DIR__.'/../../vendor/autoload.php';

(new Laravel\Lumen\Bootstrap\LoadEnvironmentVariables(
    dirname(__DIR__)
))->bootstrap();

/*
|--------------------------------------------------------------------------
| Create The Application
|--------------------------------------------------------------------------
*/
$app = new Laravel\Lumen\Application(
    dirname(__DIR__)
);

/*
|--------------------------------------------------------------------------
| Register Container Bindings
|--------------------------------------------------------------------------
*/
$app->singleton(
    Illuminate\Contracts\Debug\ExceptionHandler::class,
    Hurb\Api\Exceptions\Handler::class
);

$app->singleton(
    Illuminate\Contracts\Console\Kernel::class,
    Hurb\Api\Console\Kernel::class
);

/*
|--------------------------------------------------------------------------
| Register Middleware
|--------------------------------------------------------------------------
*/
$app->register(Hurb\CurrencyConverter\Frameworks\Lumen\CurrencyConverterServiceProvider::class);

$app->register(Illuminate\Redis\RedisServiceProvider::class);
$app->configure('database');

/*
|--------------------------------------------------------------------------
| Load The Application Routes
|--------------------------------------------------------------------------
*/

$app->router->group([
    'prefix' => 'v1',
    'namespace' => 'Hurb\Api\Http\Controllers\v1',
], function ($router) {
    $router->get('converter', [
        'as' => 'converter',
        'uses' => 'ConverterController@convert'
    ]);
});

$app->router->get('/', function (\Illuminate\Http\Request $request) {
    return redirect()->route('converter', $request->query->all());
});

return $app;
