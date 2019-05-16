<?php

namespace Hurb\CurrencyConverter\Repositories;

interface RepositoryInterface
{
    /**
     * @param string $key
     * @param mixed $value
     * @return void
     */
    public function save(string $key, $value) : void;

    /**
     * @param string $key
     * @return mixed
     */
    public function get(string $key);
}
