<?php

namespace Src;

use Src\ValidatorReturn;

class Validator {

    static $errors=[];
    static $params=[];
    static $model;

    public static function make($params, $rules) : ValidatorReturn
    {
        self::$errors = [];
        self::$params = $params;

        foreach ($rules as $fieldName => $rule) {
            $fieldRules = explode('|', $rule);
            foreach ($fieldRules as $fieldRule) {
                list($fieldRule, $ruleParams) = explode(':', $fieldRule);
                if (!method_exists(new self, $fieldRule)) {
                    throw new \Exception('Validation Method '.$fieldRule.' is not implemented.');
                    continue;
                }
                self::{$fieldRule}($fieldName, $ruleParams);
            }
        }
        return new ValidatorReturn(self::$errors);
    }

    /**
     * @param array $errors
     */
    public static function addErrors($fieldName, $error)
    {
        self::$errors[$fieldName][] = $error;
    }

    static function required($fieldName)
    {
        if (!empty(self::$params[$fieldName])) {
            return false;
        }
        self::addErrors($fieldName, vsprintf('%s is required', [$fieldName]));
    }

    static function is_upercase($fieldName)
    {
        if (self::$params[$fieldName] == strtoupper(self::$params[$fieldName])) {
            return false;
        }
        self::addErrors($fieldName, vsprintf('%s must be a uppercase', [$fieldName]));
    }

    static function required_if($fieldName, $ruleParams)
    {
        $comparasions = ['=', '<>'];
        foreach ($comparasions as $comparasion) {
            $fieldToCompare = strstr($ruleParams, $comparasion, true);
            if ($fieldToCompare === false) {
                continue;
            }
            if (empty(self::$params[$fieldToCompare])) {
                continue;
            }
            $valueToCompare = str_replace($fieldToCompare.$comparasion, '', $ruleParams);
            switch ($comparasion) {
                case '<>':
                    if (self::$params[$fieldToCompare] == $valueToCompare || !empty(self::$params[$fieldName])) {
                        continue 2;
                    }
                    $errorMessageParams = [$fieldName, $fieldToCompare, $comparasion, $valueToCompare];
                    break;
                case '=':
                    if (self::$params[$fieldToCompare] != $valueToCompare || !empty(self::$params[$fieldName])) {
                        continue 2;
                    }
                    $errorMessageParams = [$fieldName, $fieldToCompare, $comparasion, $valueToCompare];
                    break;
            }
        }
        @$errorMessage = vsprintf('%s is required if %s %s %s', $errorMessageParams);
        if (!$errorMessage) {
            return false;
        }
        self::addErrors($fieldName, $errorMessage);
    }

    static function numeric($fieldName)
    {
        if (empty(self::$params[$fieldName]) || is_numeric(self::$params[$fieldName])) {
            return false;
        }
        self::addErrors($fieldName, vsprintf('%s must be contain a numeric value', [$fieldName]));
    }

    static function attach($model)
    {
        self::$model = $model;
    }

    static function getModel($modelName)
    {
        if (self::$model) {
            return self::$model;
        }
        $modelName = '\App\Models\\'.ucfirst($modelName);
        return new $modelName();
    }

    static function unique($fieldName, $ruleParams)
    {
        if (!self::getModel($ruleParams)->where($fieldName, self::$params[$fieldName])->exists()) {
            return false;
        }
        self::addErrors($fieldName, vsprintf('%s must be a unique', [$fieldName]));
    }
}