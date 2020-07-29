<?php

declare(strict_types=1);

namespace App;

use App\Entity\CurrencyCollection;
use App\Entity\CurrencyEntity;
use App\Handler\CurrencyHandler;
use App\Handler\CurrencyHandlerFactory;
use App\Handler\ExchangeHandler;
use App\Handler\ExchangeHandlerFactory;
use App\Mapper\CurrencyMapper;
use App\Mapper\CurrencyMapperFactory;
use App\Middleware\AuthMiddleware;
use App\Middleware\AuthMiddlewareFactory;
use App\Middleware\SetupTranslatorMiddleware;
use App\Middleware\SetupTranslatorMiddlewareFactory;
use App\Middleware\VersionMiddleware;
use App\Middleware\VersionMiddlewareFactory;
use App\Service\CurrencyService;
use App\Service\CurrencyServiceFactory;
use App\Service\ExchangeService;
use App\Service\ExchangeServiceFactory;
use App\Service\ExternalApiService;
use App\Service\ExternalApiServiceFactory;
use ArrayObject;
use Laminas\Hydrator\ArraySerializableHydrator;
use Mezzio\Hal\Metadata\MetadataMap;
use Mezzio\Hal\Metadata\RouteBasedCollectionMetadata;
use Mezzio\Hal\Metadata\RouteBasedResourceMetadata;

/**
 * The configuration provider for the App module
 *
 * @see https://docs.laminas.dev/laminas-component-installer/
 */
class ConfigProvider
{
    /**
     * Returns the configuration array
     *
     * To add a bit of a structure, each section is defined in a separate
     * method which returns an array with its configuration.
     */
    public function __invoke(): array
    {
        return [
            'dependencies' => $this->getDependencies(),
            MetadataMap::class => $this->getMetadataMaps(),
        ];
    }

    /**
     * Returns the container dependencies
     */
    public function getDependencies(): array
    {
        return [
            'invokables' => [
                Handler\HealthHandler::class => Handler\HealthHandler::class,
            ],
            'factories'  => [
                AuthMiddleware::class => AuthMiddlewareFactory::class,
                VersionMiddleware::class => VersionMiddlewareFactory::class,
                SetupTranslatorMiddleware::class => SetupTranslatorMiddlewareFactory::class,

                // Handlers
                CurrencyHandler::class => CurrencyHandlerFactory::class,
                ExchangeHandler::class => ExchangeHandlerFactory::class,

                // Services
                CurrencyService::class => CurrencyServiceFactory::class,
                ExchangeService::class => ExchangeServiceFactory::class,
                ExternalApiService::class => ExternalApiServiceFactory::class,

                // Mapper
                CurrencyMapper::class => CurrencyMapperFactory::class,
            ],
        ];
    }

    private function getMetadataMaps(): array
    {
        return [
            [
                '__class__' => RouteBasedResourceMetadata::class,
                'resource_class' => CurrencyEntity::class,
                'route' => 'v1.currency.entity',
                'extractor' => ArraySerializableHydrator::class,
            ],
            [
                '__class__' => RouteBasedResourceMetadata::class,
                'resource_class' => ArrayObject::class,
                'route' => 'v1.currency.entity',
                'extractor' => ArraySerializableHydrator::class,
            ],
            [
                '__class__' => RouteBasedCollectionMetadata::class,
                'collection_class' => CurrencyCollection::class,
                'collection_relation' => 'currencies',
                'route' => 'v1.currency.collection',
            ],
        ];
    }
}
