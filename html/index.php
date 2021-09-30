<?php

use App\Application;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../src/Application.php';

$app = new Application();
$app->runWeb();
