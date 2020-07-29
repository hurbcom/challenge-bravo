<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\CollectionInterface;
use App\Entity\CurrencyEntity;
use App\Entity\EntityInterface;
use App\Exception\EntityConflict;
use App\Mapper\CurrencyMapper;
use LosMiddleware\ApiServer\Exception\ValidationException;

use function array_key_exists;
use function array_keys;

class CurrencyService
{
    private CurrencyMapper $currencyMapper;

    public function __construct(CurrencyMapper $currencyMapper)
    {
        $this->currencyMapper = $currencyMapper;
    }

    public function fetchAllPaginated(array $where = [], array $options = []): CollectionInterface
    {
        return $this->currencyMapper->fetchAllBy($where, $options);
    }

    public function fetchById(string $id): ?EntityInterface
    {
        return $this->currencyMapper->fetchById($id);
    }

    public function create(array $data): EntityInterface
    {
        $data = $this->validateBody($data);

        // check already exists
        $existingCurrency = $this->currencyMapper->fetchOneBy(['name' => $data['name']]);
        if ($existingCurrency !== null) {
            throw EntityConflict::create('There is a currency with this name!');
        }

        return $this->currencyMapper->insert(CurrencyEntity::fromArray($data));
    }

    private function validateBody(array $data, bool $validateAll = true): array
    {
        $inputFilter = $this->currencyMapper->createEntityInputFilter();
        if ($validateAll === false) {
            $inputFilter->setValidationGroup(array_keys($data));
        }

        if (! $inputFilter->setData($data)->isValid()) {
            throw ValidationException::fromMessages($inputFilter->getMessages());
        }

        $values = $inputFilter->getValues();
        $parsed = [];

        foreach ($values as $key => $value) {
            if (! array_key_exists($key, $data)) {
                continue;
            }

            $parsed[$key] = $value;
        }

        return $parsed;
    }

    public function delete(EntityInterface $entity): bool
    {
        return $this->currencyMapper->delete($entity);
    }
}
