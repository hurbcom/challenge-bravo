<?php

declare(strict_types=1);

namespace AppTest\Entity;

use App\Entity\CurrencyEntity;
use App\Entity\CurrencyInputFilter;
use App\Entity\EntityInterface;
use App\ValueObject\CurrencyId;
use DateTimeImmutable;
use Laminas\InputFilter\InputFilterAwareInterface;
use PHPUnit\Framework\TestCase;

class CurrencyEntityTest extends TestCase
{
    public function testConstruct()
    {
        $data = [
            'id' => '87b4da28-d4b4-484a-846d-acbe4d9bdbf3',
            'name' => 'BRL',
            'createdAt' => '2020-05-08 12:26:19',
            'updatedAt' => '2020-05-08 12:26:19',
        ];
        $entity = CurrencyEntity::fromArray($data);
        $this->assertInstanceOf(CurrencyId::class, $entity->id());
        $this->assertSame($data['name'], $entity->name());
        $this->assertInstanceOf(DateTimeImmutable::class, $entity->createdAt());
        $this->assertInstanceOf(DateTimeImmutable::class, $entity->updatedAt());

        $this->assertInstanceOf(InputFilterAwareInterface::class, $entity);
        $this->assertInstanceOf(EntityInterface::class, $entity);
    }

    public function testGetArrayCopy()
    {
        $data = [
            'id' => '87b4da28-d4b4-484a-846d-acbe4d9bdbf3',
            'name' => 'BRL',
            'createdAt' => '2020-05-08 12:26:19',
            'updatedAt' => '2020-05-08 12:26:19',
        ];
        $entity = CurrencyEntity::fromArray($data)->getArrayCopy();
        $this->assertSame($data['id'], $entity['id']);
        $this->assertSame($data['name'], $entity['name']);
        $this->assertSame($data['createdAt'], $entity['createdAt']);
        $this->assertSame($data['updatedAt'], $entity['updatedAt']);
    }

    public function testGetInputFilter()
    {
        $data = [
            'id' => '87b4da28-d4b4-484a-846d-acbe4d9bdbf3',
            'name' => 'BRL',
            'createdAt' => '2020-05-08 12:26:19',
            'updatedAt' => '2020-05-08 12:26:19',
        ];
        $entity = CurrencyEntity::fromArray($data);
        $this->assertInstanceOf(CurrencyInputFilter::class, $entity->getInputFilter());

        $inputFilter = $entity->getInputFilter();

        // empty data
        $inputFilter->setData([])->isValid();
        $this->assertCount(1, $inputFilter->getMessages());
        $this->assertArrayHasKey('name', $inputFilter->getMessages());

        // invalid data
        $inputFilter->setData([
            'name' => 'Mussum Ipsum, cacilds vidis litro abertis. Todo mundo vê os porris que eu tomo, mas ninguém vê os
             tombis que eu levo! Viva Forevis aptent taciti sociosqu ad litora torquent. Si u mundo tá muito paradis?'
        ])->isValid();
        $this->assertCount(1, $inputFilter->getMessages());
        $this->assertArrayHasKey('name', $inputFilter->getMessages());
        $this->assertArrayHasKey('stringLengthTooLong', $inputFilter->getMessages()['name']);
    }
}
