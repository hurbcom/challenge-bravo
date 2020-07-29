<?php

declare(strict_types=1);

namespace App\Entity;

use Laminas\Filter;
use Laminas\InputFilter\InputFilter;
use Laminas\Validator;

class CurrencyInputFilter extends InputFilter
{
    public function __construct()
    {
        $this->add([
            'required' => false,
            'validators' => [
                ['name' => Validator\Uuid::class],
            ],
            'filters' => [],
            'name' => 'id',
        ]);

        $this->add([
            'required' => true,
            'validators' => [
                ['name' => Validator\NotEmpty::class],
                [
                    'name' => Validator\StringLength::class,
                    'options' => [
                        'min' => 3,
                        'max' => 3,
                        'inclusive' => true,
                    ],
                ],
            ],
            'filters' => [
                ['name' => Filter\StringTrim::class],
                ['name' => Filter\StripTags::class],
                ['name' => Filter\StripNewlines::class],
            ],
            'name' => 'name',
        ]);
    }
}
