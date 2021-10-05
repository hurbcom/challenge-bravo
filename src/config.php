<?php

declare(strict_types=1);

use App\Connection;
use App\Repository\CurrencyRepository;
use App\Repository\CurrencyRepositoryInterface;
use App\Service\Converter\ConverterInterface;
use App\Service\Converter\ConverterService;
use Laminas\Diactoros\ResponseFactory;
use Psr\Http\Message\ResponseFactoryInterface;

use function DI\get;

return [
    ConverterInterface::class => get(ConverterService::class),
    CurrencyRepositoryInterface::class => get(CurrencyRepository::class),
    PDO::class => get(Connection::class),
    ResponseFactoryInterface::class => get(ResponseFactory::class),
];
