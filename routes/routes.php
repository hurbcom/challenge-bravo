<?php

$router->get('/', function(){
    echo "Página inicial";
});

$router->get('/contatos/{nome}', function($nome){
    echo "Página de contatos".$nome;
});

$router->get('/moedas', 'Controller@teste');
$router->get('/moedas/{uid}', 'Controller@teste');

$router->post('/contatos/store', "Controller@store");


$router->get('/currency', 'CurrencyController@index');
$router->post('/currency/store', 'CurrencyController@store');
$router->delete('/currency/{name}/delete', 'CurrencyController@delete');
$router->put('/currency/{name}/update', 'CurrencyController@update');