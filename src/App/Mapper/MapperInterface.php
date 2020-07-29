<?php

declare(strict_types=1);

namespace App\Mapper;

use App\Entity\CollectionInterface;
use App\Entity\EntityInterface;
use Laminas\InputFilter\InputFilterInterface;

interface MapperInterface
{
    public function fetchById(string $id): ?EntityInterface;

    public function fetchOneBy(array $where = [], array $options = []): ?EntityInterface;

    public function fetchAllBy(array $where = [], array $options = []): CollectionInterface;

    public function insert(EntityInterface $entity): EntityInterface;

    public function update(EntityInterface $entity, array $set): EntityInterface;

    public function delete(EntityInterface $entity): bool;

    public function createEntity(array $data): EntityInterface;

    public function createEntityInputFilter(): InputFilterInterface;
}
