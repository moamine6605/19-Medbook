<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'specialty',
        'rating',
        'reviews',
        'experience',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'float',
            'reviews' => 'integer',
            'is_featured' => 'boolean',
        ];
    }
}
