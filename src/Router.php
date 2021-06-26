<?php

namespace Src;

use Src\Request;
use Src\Dispatcher;
use Src\RouteCollection;

class Router
{
    protected $route_collection;

    public function __construct()
    {
        $this->route_collection = new RouteCollection;
        $this->dispacher = new Dispatcher;
    }

    public function get($pattern, $callback)
    {
        $this->route_collection->add('get', $pattern, $callback);
        return $this;
    }

    public function post($pattern, $callback)
    {
        $this->route_collection->add('post', $pattern, $callback);
        return $this;
    }

    public function put($pattern, $callback)
    {
        $this->route_collection->add('put', $pattern, $callback);
        return $this;
    }

    public function delete($pattern, $callback)
    {
        $this->route_collection->add('delete', $pattern, $callback);
        return $this;
    }

    public function find($request_type, $pattern)
    {
        return $this->route_collection->where($request_type, $pattern);
    }

    protected function dispach($route, $params, Request $request, $namespace = "App\\"){
        return $this->dispacher->dispach($route->callback, $params, $request, $namespace);
    }

    protected function notFound()
    {
        return header("HTTP/1.0 404 Not Found", true, 404);
    }


    public function resolve(Request $request){
        $route = $this->find($request->method(), $request->uri());
        try {
            if($route)
            {
                $params = $route->callback['values'] ? $this->getValues($request->uri(), $route->callback['values']) : [];
                return $this->dispach($route, $params, $request);
            }
            return $this->notFound();
        } catch (\Exception $e) {
            echo '<strong>Erro:</strong> '.$e->getMessage();
        }
    }

    protected function getValues($pattern, $positions)
    {
        $result = [];

        $pattern = array_filter(explode('/', $pattern));

        foreach($pattern as $key => $value)
        {
            if(in_array($key-1, $positions)) {
                $result[array_search($key-1, $positions)] = $value;
            }
        }

        return $result;

    }
}