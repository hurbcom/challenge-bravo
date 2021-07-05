<?php

require __DIR__ . '/vendor/autoload.php';

use Src\Router;

session_start();


try {

    $router = new Router;

    require __DIR__ . '/routes/routes.php';
    if (file_exists(__DIR__.'/.env')) {
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
        $dotenv->load();
    }

} catch(\Exception $e){

    echo $e->getMessage();
}