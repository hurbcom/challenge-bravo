<?php

declare(strict_types=1);

namespace App\Controller;

class HelloWorld
{
    public function __invoke(): array
    {
        return [
            'title'   => 'Hello world',
            'version' => 1,
        ];
    }
}
