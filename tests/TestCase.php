<?php

use GuzzleHttp\Client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;
use Illuminate\Support\Arr;
use Symfony\Component\Yaml\Yaml;

abstract class TestCase extends Laravel\Lumen\Testing\TestCase
{
    /**
     * Creates the application.
     *
     * @return \Laravel\Lumen\Application
     */
    public function createApplication()
    {
        return require __DIR__.'/../bootstrap/app.php';
    }

    /**
     * Mock default requests using Guzzle Clients with dependency injection
     *
     * @param string ...$filepaths
     */
    public function mockDefaultHttpClientResponses(string ...$filepaths) : void
    {
        $responses = [];
        foreach ($filepaths as $filepath) {
            $fullPath = app()->path() . sprintf("/../tests/response_mock/%s", $filepath);
            $config = Yaml::parseFile($fullPath);
            $responses[] = new Response(
                Arr::get($config, "http_status", 200),
                Arr::get($config, "headers", []),
                Arr::get($config, "body", "")
            );
        }

        $client = new Client([
            'handler' => new HandlerStack(
                new MockHandler($responses)
            )
        ]);

        $this->app->singleton(Client::class, function () use ($client) {
            return $client;
        });
    }
}
