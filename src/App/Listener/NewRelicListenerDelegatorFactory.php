<?php

declare(strict_types=1);

namespace App\Listener;

use Interop\Container\ContainerInterface;
use Laminas\ServiceManager\Factory\DelegatorFactoryInterface;
use Mezzio\ProblemDetails\ProblemDetailsMiddleware;

use function assert;

class NewRelicListenerDelegatorFactory implements DelegatorFactoryInterface
{
    /**
     * @inheritDoc
     */
    public function __invoke(
        ContainerInterface $container,
        $name,
        callable $callback,
        ?array $options = null
    ) {
        $errorHandler = $callback();
        assert($errorHandler instanceof ProblemDetailsMiddleware);
        $errorHandler->attachListener(new NewRelicListener());

        return $errorHandler;
    }
}
