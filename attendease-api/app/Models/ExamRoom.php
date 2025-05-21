<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExamRoom extends Model
{
    protected $fillable = [
        'name',
        'location',
        'capacity'
    ];

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }
} 