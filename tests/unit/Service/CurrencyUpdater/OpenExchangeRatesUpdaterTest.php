<?php

declare(strict_types=1);

namespace App\Service\Converter;

use App\Connection;
use App\Logger\UpdaterLogger;
use App\Model\Currency;
use App\Repository\CurrencyRepository;
use App\Service\CurrencyUpdater\OpenExchangeRatesUpdater;
use PDO;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;

final class OpenExchangeRatesUpdaterTest extends TestCase
{
    public function testLookup()
    {
        $oerStub = $this->getMockBuilder(OpenExchangeRatesUpdater::class)
            ->onlyMethods(['fetchRates'])
            ->setConstructorArgs([new UpdaterLogger(), new FilesystemAdapter('test1')])
            ->getMock();

        $oerStub->expects($this->exactly(1))
            ->method('fetchRates')
            ->willReturn($this->fakeRates());

        /**
         * @var OpenExchangeRatesUpdater
         */
        $oer = $oerStub;
        $this->assertTrue($oer->lookup(Currency::create('BRL'))->isEqualTo('2'));
        $this->assertTrue($oer->lookup(Currency::create('USD'))->isEqualTo('1'));
    }

    public function testUpdate()
    {
        $repoStub = $this->getMockBuilder(CurrencyRepository::class)
            ->setConstructorArgs([new Connection()])
            ->onlyMethods(['set'])
            ->getMock();

        $repoStub->expects($this->exactly(count($this->fakeRates())))
            ->method('set');

        $oerStub = $this->getMockBuilder(OpenExchangeRatesUpdater::class)
            ->onlyMethods(['fetchRates'])
            ->setConstructorArgs([new UpdaterLogger(), new FilesystemAdapter('test2')])
            ->getMock();

        $oerStub->expects($this->exactly(1))
            ->method('fetchRates')
            ->willReturn($this->fakeRates());

        /**
         * @var CurrencyRepository
         */
        $repo = $repoStub;

        /**
         * @var OpenExchangeRatesUpdater
         */
        $oer = $oerStub;
        $oer->update($repo);
    }

    private function fakeRates()
    {
        return [
            'BRL' => 2,
            'USD' => 1
        ];
    }
}
