<?php

namespace App\Repositories;

class MoedaRepository extends RepositoryAbstract
{
    public function __construct()
    {
        parent::__construct(__CLASS__);
        return $this;
    }
}