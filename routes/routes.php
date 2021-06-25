<?php

$router->get('/', function(){
    echo "Página inicial";
});

$router->get('/contatos', function(){
    echo "Página de contatos";
});

$router->post('/contatos/store', "Controller@store");