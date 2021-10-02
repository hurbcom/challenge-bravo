<?php

declare(strict_types=1);

namespace App;

use PDO;

class Connection extends PDO
{
    public function __construct()
    {
        $path = realpath(__DIR__ . '/../db/db.sqlite3');

        $args = [
            "sqlite:$path",
        ];

        parent::__construct(...$args);
    }
}
