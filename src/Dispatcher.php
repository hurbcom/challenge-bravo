<?php

namespace Src;

class Dispatcher
{

    public function dispach($callback, $params = [], $namespace = "App\\")
    {
        if (is_callable($callback)) {
            return call_user_func_array($callback, array_values($params));
        }
        return $this->callControllerMethod($callback, $params, $namespace);
    }

    protected function callControllerMethod(string $callback, $params = [], $namespace = "App\\")
    {
        if (strpos($callback, '@') === false) {
            //ERRO
        }
        list($controller, $method) = explode('@', $callback);
        $controller = "App\\".$controller;
        if (!class_exists($controller) || !method_exists($controller, $method)) {
            throw new \Exception("Erro ao despachar: controller não pode ser instanciado, ou método não exite");
        }
        $class = new $controller;

//        print_r($params);exit;

        return $class->$method($params);
    }
}
