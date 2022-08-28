<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'color'];

    public function users()
    {
        return $this->morphedByMany(User::class, 'taggable');
    }

    public function courses()
    {
        return $this->morphedByMany(Course::class, 'taggable');
    }
}
