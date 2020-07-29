<?php


namespace AppTest;


use Laminas\ServiceManager\Config;
use Laminas\ServiceManager\ServiceManager;
use Mezzio\Helper\UrlHelper;
use Mezzio\Router\Route;
use Mezzio\Router\RouteResult;
use Mezzio\Router\RouterInterface;
use Psr\Container\ContainerInterface;

trait BoostrapContainer
{
    private ?ContainerInterface $container = null;
    private array $routes;

    private function createContainer(): ContainerInterface
    {
        if ($this->container == null) {
            $config = require __DIR__ .'/../../../config/config.php';
            $container = new ServiceManager();
            (new Config($config['dependencies']))->configureServiceManager($container);
            $container->setService('config', $config);
            $this->container = $container;
            $this->injectRoutes($config);
        }
        return $this->container;
    }

    private function injectRoutes($config): void
    {
        $routes = $config['routes'] ?? [];

        $router = $this->container->get(RouterInterface::class);
        foreach ($routes as $spec) {
            if (isset($spec['allowed_methods'])) {
                $methods = $spec['allowed_methods'];
                if (! is_array($methods)) {
                    continue;
                }
            } else {
                $methods = Route::HTTP_METHOD_ANY;
            }
            $name    = isset($spec['name']) ? $spec['name'] : null;
            $route   = new Route($spec['path'], $spec['middleware'], $methods, $name);
            $this->routes[$name] = $route;
            $router->addRoute($route);
        }
    }

    private function matchRoute(string $routeName): void
    {
        $urlHelper = $this->container->get(UrlHelper::class);
        $urlHelper->setRouteResult(RouteResult::fromRoute($this->routes[$routeName], []));
    }
}