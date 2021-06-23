<?php

namespace App\Models\Traits;

use Ramsey\Uuid\Uuid;

trait UuidTrait 
{
    public static function bootUuid() 
    {
        static::creating(function ($model) {
            $model->uid = Uuid::uuid4();
        });
    }
}