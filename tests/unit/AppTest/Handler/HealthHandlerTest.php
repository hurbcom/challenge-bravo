<?php

declare(strict_types=1);

namespace AppTest\Handler;

use App\Handler\HealthHandler;
use Laminas\Diactoros\Response\JsonResponse;
use PHPUnit\Framework\TestCase;
use Prophecy\PhpUnit\ProphecyTrait;
use Psr\Http\Message\ServerRequestInterface;

use function json_decode;

class HealthHandlerTest extends TestCase
{
    use ProphecyTrait;

    public function testResponse()
    {
        $pingHandler = new HealthHandler();
        $response = $pingHandler->handle(
            $this->prophesize(ServerRequestInterface::class)->reveal()
        );

        $json = json_decode((string) $response->getBody());

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertTrue(isset($json->version));
    }
}
