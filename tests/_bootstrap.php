<?php

use Codeception\Lib\ParamsLoader;

require __DIR__ . '/../vendor/autoload.php';

$envFile = __DIR__ . '/env.yml';
if (file_exists($envFile)) {
    foreach((new ParamsLoader())->load($envFile) as $key => $value) {
        putenv(sprintf('%s=%s', $key, $value));
    }
}

date_default_timezone_set(getenv('TIMEZONE'));
define('URL_API', 'http://localhost:8080');
define('REQUEST_ID', \Ramsey\Uuid\Uuid::uuid4()->toString());
