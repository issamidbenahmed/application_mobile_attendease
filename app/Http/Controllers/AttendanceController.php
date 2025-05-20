<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Attendance::with('student');
        
        // Filtrer par date si spécifié
        if ($request->has('date')) {
            $date = $request->input('date');
            $query->whereDate('attended_at', $date);
        }
        
        // Filtrer par cours si spécifié
        if ($request->has('course')) {
            $course = $request->input('course');
            $query->where('course', $course);
        }
        
        $attendances = $query->latest('attended_at')->get();
        
        return JsonResource::collection($attendances);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'status' => 'required|string|in:present,absent,late,excused',
            'course' => 'nullable|string|max:100',
            'attended_at' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        // Ajouter l'utilisateur connecté qui marque la présence
        $validated['user_id'] = Auth::id();
        
        $attendance = Attendance::create($validated);

        return response()->json([
            'message' => 'Présence enregistrée avec succès',
            'attendance' => new JsonResource($attendance->load('student'))
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Attendance $attendance): JsonResource
    {
        return new JsonResource($attendance->load('student', 'user'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Attendance $attendance): JsonResponse
    {
        $validated = $request->validate([
            'student_id' => 'sometimes|exists:students,id',
            'status' => 'sometimes|string|in:present,absent,late,excused',
            'course' => 'nullable|string|max:100',
            'attended_at' => 'sometimes|date',
            'notes' => 'nullable|string',
        ]);

        $attendance->update($validated);

        return response()->json([
            'message' => 'Présence mise à jour avec succès',
            'attendance' => new JsonResource($attendance->load('student'))
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendance $attendance): JsonResponse
    {
        $attendance->delete();

        return response()->json([
            'message' => 'Présence supprimée avec succès'
        ]);
    }
    
    /**
     * Mark attendance by student code (apogee or CNE).
     */
    public function markByCode(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string',  // Peut être code_apogee ou CNE
            'status' => 'required|string|in:present,absent,late,excused',
            'course' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        // Recherche de l'étudiant par code_apogee ou CNE
        $student = Student::where('code_apogee', $validated['code'])
            ->orWhere('cne', $validated['code'])
            ->first();
            
        if (!$student) {
            return response()->json([
                'message' => 'Étudiant non trouvé avec ce code'
            ], 404);
        }
        
        // Créer la présence
        $attendance = Attendance::create([
            'student_id' => $student->id,
            'user_id' => Auth::id(),
            'status' => $validated['status'],
            'course' => $validated['course'] ?? null,
            'attended_at' => now(),
            'notes' => $validated['notes'] ?? null,
        ]);
        
        return response()->json([
            'message' => 'Présence enregistrée avec succès',
            'attendance' => new JsonResource($attendance->load('student'))
        ], 201);
    }
    
    /**
     * Get attendance statistics.
     */
    public function stats(Request $request): JsonResponse
    {
        // Stats par statut
        $statusStats = Attendance::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->get();
            
        // Stats par cours (si applicable)
        $courseStats = Attendance::selectRaw('course, count(*) as count')
            ->whereNotNull('course')
            ->groupBy('course')
            ->get();
            
        // Stats par jour
        $dailyStats = Attendance::selectRaw('DATE(attended_at) as date, count(*) as count')
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->limit(30)
            ->get();
            
        return response()->json([
            'status_stats' => $statusStats,
            'course_stats' => $courseStats,
            'daily_stats' => $dailyStats,
        ]);
    }
} 