<?php

$router->get('/', function(){
    echo "Página inicial";
});

$router->get('/contatos', function(){
    echo "Página de contatos";
});

$router->get('/moedas', 'Controller@teste');

$router->post('/contatos/store', "Controller@store");