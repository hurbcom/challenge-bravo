<?php
namespace App\GraphQL\Exceptions;

use Folklore\GraphQL\Error\ValidationError;
use Rebing\GraphQL\GraphQL;
use GraphQL\Error\Error;

class GraphQLExceptions extends GraphQL 
{
    public static $params = []; 

    public static function formatError(Error $e)
    {
        $error = [
            'message' =>  $e->getMessage()
        ];
        if(count(GraphQLExceptions::$params) > 0){
            $error = array_merge($error, GraphQLExceptions::$params);
            GraphQLExceptions::$params = [];
        }
        $locations = $e->getLocations();
        if(!empty($locations))
        {
            $error['locations'] = array_map(function($loc)
            {
                return $loc->toArray();
            }, $locations);
        }
        $previous = $e->getPrevious();
        if($previous && $previous instanceof ValidationError)
        {
            $error['validation'] = $previous->getValidatorMessages();
        }
        return $error;
    }
}