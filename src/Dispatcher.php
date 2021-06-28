<?php

namespace Src;

use Src\Request;

class Dispatcher
{

    public function dispach($callback, $params = [], Request $request, $namespace = "App\\")
    {
        if (is_callable($callback['callback'])) {
            return call_user_func_array($callback['callback'], array_values($params));
        }
        return $this->callControllerMethod($callback, $params, $request, $namespace);
    }

    protected function callControllerMethod($callback, $params = [], Request $request, $namespace = "App\\")
    {
        if (strpos($callback['callback'], '@') === false) {
            //ERRO
        }
        list($controller, $method) = explode('@', $callback['callback']);
        $controller = "App\\".$controller;
        echo $controller;
        if (!class_exists($controller) || !method_exists($controller, $method)) {
            echo 'Não achou a classe';exit;
            throw new \Exception("Erro ao despachar: controller não pode ser instanciado, ou método não exite");
        }

        exit;
        return call_user_func_array(array(new $controller($request), $method), array_values($params));
    }
}
