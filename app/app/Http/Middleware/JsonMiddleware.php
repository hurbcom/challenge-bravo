<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\JsonResponse;

class JsonMiddleware
{
    /**
     * The Response Factory our app uses
     *
     * @var (object)
     * @access protected
     */
    protected $factory;

    /**
     * JsonMiddleware constructor.
     *
     * @param (object) ResponseFactory factory - ResponseFactory object
     * 
     * @return (void)
     */
    public function __construct( ResponseFactory $factory )
    {
        $this->factory = $factory;
    }

    /**
     * Handle an incoming request.
     *
     * @param  (object) \Illuminate\Http\Request request - Request object
     * @param  (object) \Closure next - Closure object
     *
     * @return (string)
     */
    public function handle( Request $request, Closure $next )
    {
        // First, set the header so any other middleware knows we're
        // dealing with a should-be JSON response.
        $request->headers->set( 'Accept', 'application/json' );

        // Get the response
        $response = $next( $request );

        // If the response is not strictly a JsonResponse, we make it
        if ( !$response instanceof JsonResponse )
        {
            $response = $this->factory->json(
                $response->content(), $response->status(), $response->headers->all()
            );
        }

        return $response;
    }
}