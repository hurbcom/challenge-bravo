<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Preference extends Model
{
    use HasFactory;

    protected $fillable = [
        'notify_emails',
        'notify',
        'background_color',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
