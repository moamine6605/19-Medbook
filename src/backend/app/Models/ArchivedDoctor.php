<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArchivedDoctor extends Model
{
    protected $fillable = [
        'doctor_id',
        'user_id',
        'name',
        'specialty',
        'rating',
        'reviews',
        'experience',
        'phone',
        'address',
        'bio',
        'archived_at',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'float',
            'reviews' => 'integer',
            'archived_at' => 'datetime',
        ];
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
