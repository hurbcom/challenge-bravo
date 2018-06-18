<?php

use \App\Repositories\RateRepository;
use \App\Services\ConverterService;
use \App\Exceptions\ConversionException;

class ConverterServiceTest extends TestCase
{

    public function testConversionFromBRLtoCAD()
    {
        // setup
        $from = "BRL";
        $to = "CAD";
        $amount = 1.0;
        $brlRate = 3.736404;
        $cadRate = 1.317830;

        $rateRepository = $this->createMock(RateRepository::class);

        $rateRepository->expects($this->exactly(2))
            ->method('getBallastRateFor')
            ->will($this->onConsecutiveCalls($brlRate, $cadRate));

        $converterService = new ConverterService($rateRepository);

        // execution
        $actual = $converterService->getConversionWith($from, $to, $amount);

        // assertions
        $this->assertEquals(0.35270008275336395, $actual);
    }

    public function testConversionException()
    {
        // setup
        $this->expectException(ConversionException::class);
        $from = "BRL";
        $to = "CAD";
        $amount = 1.0;

        $rateRepository = $this->createMock(RateRepository::class);

        $rateRepository
            ->method('getBallastRateFor')
            ->will($this->throwException(new \Exception()));

        $converterService = new ConverterService($rateRepository);

        // execution
        $converterService->getConversionWith($from, $to, $amount);
    }
}
