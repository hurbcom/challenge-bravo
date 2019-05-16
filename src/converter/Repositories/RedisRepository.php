<?php

namespace Hurb\CurrencyConverter\Repositories;

use Predis\ClientInterface as Client;

class RedisRepository implements RepositoryInterface
{
    /**
    * @var Client
    */
    private $client;

    /**
     * @param Client $client
     * @return void
     */
    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    /**
     * @param string $key
     * @param mixed $value
     * @return void
     */
    public function save(string $key, $value) : void
    {
        $this->client->set($key, $value);
    }

    /**
     * @param string $key
     * @return mixed
     */
    public function get(string $key)
    {
        return $this->client->get($key);
    }
}
