<?php

namespace App\GraphQL\Query;

use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;

class VersionQuery extends Query
{
    protected $attributes = [
        'name' => 'VersionQuery',
        'description' => 'Informação da versão do projeto',
    ];

    public function type()
    {
        return Type::string();
    }

    public function resolve($root, $args)
    {
        return env('APP_VERSION', '1');
    }
}
