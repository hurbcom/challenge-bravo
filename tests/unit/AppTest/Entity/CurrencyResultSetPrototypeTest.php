<?php

declare(strict_types=1);

namespace AppTest\Entity;

use App\Entity\CurrencyEntity;
use App\Entity\CurrencyResultSetPrototype;
use Laminas\Db\ResultSet\AbstractResultSet;
use PHPUnit\Framework\TestCase;
use Prophecy\PhpUnit\ProphecyTrait;

class CurrencyResultSetPrototypeTest extends TestCase
{
    use ProphecyTrait;

    public function testConstruct()
    {
        $prototype = new CurrencyResultSetPrototype();
        $this->assertInstanceOf(AbstractResultSet::class, $prototype);
    }

    public function testCurrentNull()
    {
        $prototype = new CurrencyResultSetPrototype();
        $prototype->initialize([]);
        $current = $prototype->current();
        $this->assertNull($current);
    }

    public function testCurrentEntity()
    {
        $prototype = new CurrencyResultSetPrototype();
        $prototype->initialize([
            [
                'id' => '87b4da28-d4b4-484a-846d-acbe4d9bdbf3',
                'name' => 'BRL',
                'createdAt' => '2020-05-08 12:26:19',
                'updatedAt' => '2020-05-08 12:26:19',
            ]
        ]);

        $current = $prototype->current();
        $this->assertInstanceOf(CurrencyEntity::class, $current);
    }
}
