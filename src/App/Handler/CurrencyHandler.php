<?php

declare(strict_types=1);

namespace App\Handler;

use App\Exception\EntityConflict;
use App\Service\CurrencyService;
use Laminas\Diactoros\Response\JsonResponse;
use LosMiddleware\ApiServer\Entity\Entity;
use LosMiddleware\ApiServer\Exception\ValidationException;
use Mezzio\Hal\HalResponseFactory;
use Mezzio\Hal\Metadata\RouteBasedCollectionMetadata;
use Mezzio\Hal\ResourceGenerator;
use Mezzio\ProblemDetails\ProblemDetailsResponseFactory;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Throwable;

use function array_merge;
use function assert;
use function get_class;

class CurrencyHandler implements MiddlewareInterface
{
    private CurrencyService $currencyService;
    private HalResponseFactory $halResponseFactory;
    private ResourceGenerator $resourceGenerator;
    private ProblemDetailsResponseFactory $problemDetails;

    public function __construct(
        CurrencyService $currencyService,
        HalResponseFactory $halResponseFactory,
        ResourceGenerator $resourceGenerator,
        ProblemDetailsResponseFactory $problemDetails
    ) {
        $this->currencyService    = $currencyService;
        $this->halResponseFactory = $halResponseFactory;
        $this->resourceGenerator  = $resourceGenerator;
        $this->problemDetails     = $problemDetails;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        if ($request->getMethod() === 'GET') {
            return $this->handleGet($request);
        }

        if ($request->getMethod() === 'POST') {
            return $this->handlePost($request);
        }

        if ($request->getMethod() === 'DELETE') {
            return $this->handleDelete($request);
        }

        return $this->problemDetails->createResponse($request, 405, 'Method not allowed');
    }

    private function handleGet(ServerRequestInterface $request): ResponseInterface
    {
        if ($request->getAttribute('id')) {
            $entity = $this->currencyService->fetchById($request->getAttribute('id'));
            if ($entity === null) {
                return $this->problemDetails->createResponse($request, 404, 'Entity not found');
            }

            assert($entity instanceof Entity);
            $resource = $this->resourceGenerator->fromObject($entity, $request);

            return $this->halResponseFactory->createResponse($request, $resource);
        }

        $collection = $this->currencyService->fetchAllPaginated();

        $queryParams = $request->getQueryParams();
        $metadataMap = $this->resourceGenerator->getMetadataMap();
        $metadata    = $metadataMap->get(get_class($collection));
        assert($metadata instanceof RouteBasedCollectionMetadata);
        $metadataQuery = $origMetadataQuery = $metadata->getQueryStringArguments();
        foreach ($queryParams as $key => $value) {
            $metadataQuery = array_merge($metadataQuery, [$key => $value]);
        }

        $metadata->setQueryStringArguments($metadataQuery);
        $resource = $this->resourceGenerator->fromObject($collection, $request);
        $metadata->setQueryStringArguments($origMetadataQuery);

        return $this->halResponseFactory->createResponse($request, $resource);
    }

    private function handlePost(ServerRequestInterface $request): ResponseInterface
    {
        $data = $request->getParsedBody();

        try {
            $newEntity = $this->currencyService->create($data);
        } catch (EntityConflict | ValidationException $exception) {
            return $this->problemDetails->createResponseFromThrowable($request, $exception);
        } catch (Throwable $exception) {
            return $this->problemDetails->createResponse($request, 400, 'Oops! Something went wrong!');
        }

        return new JsonResponse($newEntity->getArrayCopy(), 201);
    }

    private function handleDelete(ServerRequestInterface $request): ResponseInterface
    {
        $entity = $this->currencyService->fetchById($request->getAttribute('id'));
        if ($entity === null) {
            return $this->problemDetails->createResponse($request, 404, 'Entity not found');
        }

        try {
            $this->currencyService->delete($entity);
        } catch (Throwable $exception) {
            return $this->problemDetails->createResponse($request, 400, 'Oops! Something went wrong!');
        }

        return new JsonResponse([], 204);
    }
}
