<?php

declare(strict_types=1);

namespace App\Mapper;

use App\Entity\CurrencyCollection;
use App\Entity\CurrencyEntity;
use App\Entity\CurrencyInputFilter;
use App\Entity\CurrencyResultSetPropotype;
use Interop\Container\ContainerInterface;
use Laminas\Cache\StorageFactory;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\TableGateway\TableGateway;

class CurrencyMapperFactory
{
    public function __invoke(ContainerInterface $container): CurrencyMapper
    {
        $config  = $container->get('config');
        $adapter = new Adapter($config['db']['mysql']);
        $table   = new TableGateway('currency', $adapter, null, new CurrencyResultSetPropotype());

        return new CurrencyMapper(
            $table,
            CurrencyEntity::class,
            CurrencyCollection::class,
            CurrencyInputFilter::class,
            StorageFactory::factory($config['cache']['api']),
        );
    }
}
