<?php
namespace App\Helpers;

use Exception;

class ExceptionHelper
{
    /**
     * Catch Exception Message.
     * @param Exception $exception
     *
     * @return String
     */
    public static function catchExceptionMessage(Exception $exception): String
    {
        $exceptionMessage = $exception->getMessage();

        if($exceptionMessage == 'The given data was invalid.'){
            $exceptionErrors = $exception->errors();

            foreach($exceptionErrors as $errors){
                $exceptionMessage = array_shift($errors);
                break;
            }
        }

        return $exceptionMessage;
    }

    /**
     * Catch Exception Code.
     * @param Exception $exception
     *
     * @return Int
     */
    public static function catchExceptionCode(Exception $exception): Int
    {
        return (empty($exception->getCode()) || !is_numeric($exception->getCode()))
            ? 422
            : $exception->getCode();
    }
}
