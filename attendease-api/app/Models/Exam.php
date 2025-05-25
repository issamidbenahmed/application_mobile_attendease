<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exam extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'code',
        'intitule',
        'date',
        'heure_debut',
        'heure_fin',
        'filiere',
        'niveau',
        'groupe',
        'matiere',
        'enseignant',
        'salle'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
    ];
    
    /**
     * Get the name attribute (alias for intitule)
     */
    public function getNameAttribute()
    {
        return $this->intitule;
    }
    
    /**
     * Get the start date as a datetime string
     */
    public function getStartDateAttribute()
    {
        return $this->date->format('Y-m-d');
    }
    
    /**
     * Get the formatted time range
     */
    public function getTimeRangeAttribute()
    {
        return $this->heure_debut . ' - ' . $this->heure_fin;
    }

    /**
     * Get the exam rooms for the exam.
     */
    public function examRooms()
    {
        return $this->hasMany(ExamRoom::class);
    }
}
