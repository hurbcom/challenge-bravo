<?php

namespace App\GraphQL\Query;

use App\Services\ConvertCurrencyService;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;

class ConvertCurrencyQuery extends Query
{
    protected $attributes = [
        'name' => 'ConvertCurrencyQuery',
        'description' => 'Query para converter as moedas',
    ];

    public function args()
    {
        return [
            'from' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'Moeda base do valor',
            ],
            'to' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'Moeda de conversão',
            ],
            'amount' => [
                'type' => Type::nonNull(Type::float()),
                'description' => 'Valor a ser convertido',
            ],
        ];
    }

    public function type()
    {
        return Type::string();
    }

    public function resolve($root, $args)
    {
        $from = $args["from"];
        $to = $args["to"];
        $amount = $args["amount"];

        $service = new ConvertCurrencyService;
        $return = $service->convert($from, $to, $amount);
        return $return;
    }
}
