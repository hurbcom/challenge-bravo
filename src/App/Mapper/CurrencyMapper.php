<?php

declare(strict_types=1);

namespace App\Mapper;

use App\Entity\CollectionInterface;
use App\Entity\CurrencyEntity;
use App\Entity\EntityInterface;
use DateTimeImmutable;
use Laminas\Cache\Storage\StorageInterface;
use Laminas\Db\ResultSet\ResultSet;
use Laminas\Db\Sql\Select;
use Laminas\Db\Sql\Where;
use Laminas\Db\TableGateway\TableGateway;
use Laminas\InputFilter\InputFilterInterface;
use Laminas\Paginator\Adapter\DbSelect;
use Laminas\Paginator\Paginator;
use Los\Uql\ZendDbBuilder;

use function array_merge;
use function array_unique;
use function assert;
use function count;
use function date;

class CurrencyMapper implements MapperInterface
{
    protected TableGateway $tableGateway;
    private string $entityClass;
    private string $collectionClass;
    private string $inputFilterClass;
    private ?StorageInterface $cache;

    public function __construct(
        TableGateway $collection,
        string $entityClass,
        string $collectionClass,
        string $inputFilterClass,
        ?StorageInterface $cache = null
    ) {
        $this->tableGateway     = $collection;
        $this->entityClass      = $entityClass;
        $this->collectionClass  = $collectionClass;
        $this->inputFilterClass = $inputFilterClass;
        $this->cache            = $cache;
    }

    public function fetchById(string $id): ?EntityInterface
    {
        return $this->fetchOneBy(['id' => $id]);
    }

    public function fetchOneBy(array $where = [], array $options = []): ?EntityInterface
    {
        $paginator = $this->fetchAllBy($where, $options);
        assert($paginator instanceof Paginator);
        if ($paginator->count() === 0) {
            return null;
        }

        return $this->createEntity($paginator->getCurrentItems()->current()->getArrayCopy());
    }

    public function fetchAllBy(array $where = [], array $options = []): CollectionInterface
    {
        $sql    = $this->tableGateway->getSql();
        $select = $sql->select();
        $select = (new ZendDbBuilder($select))->fromParams($where, $options);

        $dbAdapter = new DbSelect(
            $select,
            $sql,
            $this->tableGateway->getResultSetPrototype()
        );

        $collection = new $this->collectionClass($dbAdapter);
        if ($this->cache !== null) {
            $collection->setCache($this->cache);
        }

        return $collection;
    }

    public function insert(EntityInterface $entity): EntityInterface
    {
        $data              = $entity->getArrayCopy();
        $now               = new DateTimeImmutable();
        $data['createdAt'] = $now->format('Y-m-d H:i:s');
        $data['updatedAt'] = $now->format('Y-m-d H:i:s');
        $this->tableGateway->insert($data);

        return $this->createEntity(array_merge($entity->getArrayCopy(), $data));
    }

    public function update(EntityInterface $entity, array $set): EntityInterface
    {
        $set['updatedAt'] = date('Y-m-d H:i:s');
        $this->tableGateway->update(['id' => $entity->id()->toString()], $set);

        return $this->createEntity(array_merge($entity->getArrayCopy(), $set));
    }

    public function delete(EntityInterface $entity): bool
    {
        return (bool) $this->tableGateway->delete(['id' => $entity->id()->toString()]);
    }

    public function createEntity(array $data): EntityInterface
    {
        return $this->entityClass::fromArray($data);
    }

    public function createEntityInputFilter(): InputFilterInterface
    {
        return new $this->inputFilterClass();
    }

    /**
     * @param array $names
     *
     * @return CurrencyEntity[]|null
     */
    public function fetchByNames(array $names): ?array
    {
        $result = $this->tableGateway->select(static function (Select $select) use ($names): void {
            $select->where((new Where())->in('name', $names));
        });
        assert($result instanceof ResultSet);
        if ($result->count() !== count(array_unique($names))) {
            return null;
        }

        return $result->toArray();
    }
}
