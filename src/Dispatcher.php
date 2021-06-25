<?php

namespace Src;

class Dispatcher
{

    public function dispach($callback, $params = [], $namespace = "App\\")
    {
        if (is_callable($callback['callback'])) {
            print_r($params);
            return call_user_func_array($callback['callback'], array_values($params));
        }
        return $this->callControllerMethod($callback, $params, $namespace);
    }

    protected function callControllerMethod($callback, $params = [], $namespace = "App\\")
    {
        if (strpos($callback['callback'], '@') === false) {
            //ERRO
        }
        list($controller, $method) = explode('@', $callback['callback']);
        $controller = "App\\".$controller;
        if (!class_exists($controller) || !method_exists($controller, $method)) {
            throw new \Exception("Erro ao despachar: controller não pode ser instanciado, ou método não exite");
        }

        return call_user_func_array(array(new $controller, $method), array_values($params));
    }
}
