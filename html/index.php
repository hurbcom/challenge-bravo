<?php

use App\Application;

require __DIR__ . '/../src/bootstrap.php';
require __DIR__ . '/../src/Application.php';

$app = new Application();
$app->runWeb();
