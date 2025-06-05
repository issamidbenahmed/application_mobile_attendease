<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    /**
     * Display a listing of students with their attendance status.
     */
    public function index(Request $request)
    {
        if (!$request->has('exam_room_id')) {
            return response()->json([
                'message' => 'ID de la salle requis'
            ], 400);
        }

        $examRoomId = $request->exam_room_id;
        
        // Récupérer tous les étudiants
        $students = Student::all();
        
        // Récupérer les présences pour la salle spécifiée
        if (!$request->has('exam_room_id')) {
            return response()->json([
                'message' => 'ID de la salle requis'
            ], 400);
        }

        $examRoomId = $request->exam_room_id;
        $query = Attendance::where('exam_room_id', $examRoomId);
        if ($request->has('course')) {
            $query->where('course', $request->course);
        }
        $attendances = $query->get();
        
        // Créer un tableau des étudiants présents pour cette salle
        $presentStudents = $attendances->pluck('student_code_apogee')->toArray();
        
        // Formater les données pour la réponse
        $result = $students->map(function ($student) use ($presentStudents, $examRoomId) {
            // Trouver la présence de l'étudiant pour cette salle spécifique
            $attendance = $student->attendances()
                ->where('exam_room_id', $examRoomId)
                ->first();

            return [
                'student' => $student,
                'status' => in_array($student->code_apogee, $presentStudents) ? 'present' : 'absent',
                'attended_at' => $attendance?->attended_at ?? null,
                'exam_room_id' => $examRoomId,
                'professeur_nom' => $attendance?->professeur_nom ?? '',
            ];
        });

        return response()->json(['data' => $result]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return response()->json([
            'message' => 'Utilisez /attendances/mark-by-code pour créer une présence.'
        ], 405);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $attendance = Attendance::with(['student', 'examRoom'])->find($id);
        
        if (!$attendance) {
            return response()->json([
                'message' => 'Présence non trouvée'
            ], 404);
        }

        return response()->json(['data' => $attendance]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $attendance = Attendance::find($id);
        
        if (!$attendance) {
            return response()->json([
                'message' => 'Présence non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'student_code_apogee' => 'exists:students,code_apogee',
            'exam_room_id' => 'exists:exam_rooms,id',
            'status' => 'in:present,absent,late,excused',
            'course' => 'nullable|string|max:100',
            'attended_at' => 'sometimes|date',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $attendance->update($request->all());

        return response()->json([
            'message' => 'Présence mise à jour avec succès',
            'data' => $attendance
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $attendance = Attendance::find($id);
        
        if (!$attendance) {
            return response()->json([
                'message' => 'Présence non trouvée'
            ], 404);
        }

        $attendance->delete();

        return response()->json([
            'message' => 'Présence supprimée avec succès'
        ]);
    }

    /**
     * Mark attendance by QR code.
     */
    public function markByCode(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'code_apogee' => 'required|string',
            'cne' => 'required|string',
            'exam_room_id' => 'required|exists:exam_rooms,id',
            'professeur_nom' => 'nullable|string',
            'course' => 'nullable|string',
        ]);

        $student = Student::where('code_apogee', $validated['code_apogee'])->first();

        if (!$student) {
            return response()->json(['message' => 'Étudiant non trouvé'], 404);
        }

        $attendance = Attendance::create([
            'student_code_apogee' => $student->code_apogee,
            'exam_room_id' => $validated['exam_room_id'],
            'status' => 'present',
            'attended_at' => now(),
            'professeur_nom' => $validated['professeur_nom'] ?? null,
            'course' => $validated['course'] ?? null,
        ]);

        return response()->json([
            'message' => 'Présence enregistrée avec succès',
            'data' => $attendance
        ], 201);
    }

    /**
     * Get attendance statistics.
     */
    public function stats(Request $request)
    {
        $query = Attendance::query();

        // Filtrer par salle si spécifié
        if ($request->has('exam_room_id')) {
            $query->where('exam_room_id', $request->exam_room_id);
        }

        $totalAttendances = $query->count();
        
        $today = Carbon::now()->toDateString();
        $todayAttendances = (clone $query)->whereDate('created_at', $today)->count();
        
        $statuses = (clone $query)
            ->select('status')
            ->selectRaw('count(*) as count')
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status')
            ->toArray();

        return response()->json([
            'data' => [
                'total_attendances' => $totalAttendances,
                'today_attendances' => $todayAttendances,
                'statuses' => $statuses
            ]
        ]);
    }
}
