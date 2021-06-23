<?php

namespace App\Models\Traits;

use Ramsey\Uuid\Uuid;

trait UuidTrait 
{
    public static function booted() 
    {
        static::creating(function ($model) {
            $model->uid = Uuid::uuid4();
        });
    }
}