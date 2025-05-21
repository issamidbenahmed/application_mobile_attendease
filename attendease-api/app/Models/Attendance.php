<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory;

    /**
     * Les attributs qui sont assignables en masse.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'student_code_apogee',
        'exam_room_id',
        'status',
        'course',
        'attended_at',
        'notes',
    ];

    protected $casts = [
        'attended_at' => 'datetime',
    ];

    /**
     * Get the student that owns the attendance.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_code_apogee', 'code_apogee');
    }

    /**
     * Get the exam room that owns the attendance.
     */
    public function examRoom(): BelongsTo
    {
        return $this->belongsTo(ExamRoom::class);
    }
}
