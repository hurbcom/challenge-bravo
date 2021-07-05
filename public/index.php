<?php
require __DIR__ . '/../bootstrap.php';

$request = new Src\Request;
$router->resolve($request);