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
    public function index()
    {
        // 1. Récupérer tous les étudiants
        $students = Student::all();

        // 2. Récupérer les présences pour aujourd'hui
        $today = Carbon::now()->toDateString();
        $attendances = Attendance::whereDate('attended_at', $today)
                                ->get()
                                ->keyBy('student_code_apogee');

        // 3. Construire la liste avec le statut pour chaque étudiant
        $studentListWithStatus = $students->map(function ($student) use ($attendances) {
            $attendance = $attendances->get($student->code_apogee);
            $status = $attendance ? $attendance->status : 'absent';
            
            return [
                'nom' => $student->nom,
                'prenom' => $student->prenom,
                'code_apogee' => $student->code_apogee,
                'cne' => $student->cne,
                'status' => $status,
                'attended_at' => $attendance ? $attendance->attended_at : null,
                'course' => $attendance ? $attendance->course : null,
            ];
        });

        return response()->json(['data' => $studentListWithStatus]);
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
        $attendance = Attendance::with('student')->find($id);
        
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
            'nom' => 'string|max:100',
            'prenom' => 'string|max:100',
            'status' => 'in:présent,absent,retard,excusé',
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

        $validator = Validator::make($request->all(), [
            // Accepte 'code' ou 'codeApogee' comme identifiant
            'code' => 'nullable|string',
            'codeApogee' => 'nullable|string',
            'course' => 'nullable|string|max:100',
            'status' => 'required|string|in:present,absent,late,excused',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails() || (!$request->code && !$request->codeApogee)) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Prend 'codeApogee' si présent, sinon 'code'
        $studentCode = $request->codeApogee ?? $request->code;

        // Rechercher l'étudiant par code_apogee ou CNE
        $student = Student::where('code_apogee', $studentCode)
                          ->orWhere('cne', $studentCode)
                          ->first();

        if (!$student) {
            return response()->json([
                'message' => 'Student not found with this code'
            ], 404);
        }

        $today = Carbon::now()->toDateString();
        $course = $request->course ?? 'Main Course';
        $existingAttendance = Attendance::where('student_code_apogee', $student->code_apogee)
            ->whereDate('attended_at', $today)
            ->where('course', $course)
            ->first();
        if ($existingAttendance) {
            return response()->json([
                'message' => 'Student already marked present for this course today',
                'data' => $existingAttendance
            ], 200);
        }
        $attendance = Attendance::create([
            'student_code_apogee' => $student->code_apogee,
            'nom' => $student->nom,
            'prenom' => $student->prenom,
            'status' => $request->status ?? 'present',
            'course' => $course,
            'attended_at' => now(),
            'notes' => $request->notes
        ]);
        return response()->json([
            'message' => 'Attendance marked successfully',
            'data' => [
                'attendance' => $attendance,
                'student' => $student
            ]
        ], 201);
    }

    /**
     * Get attendance statistics.
     */
    public function stats()
    {
        $totalStudents = Student::count();
        $totalAttendances = Attendance::count();
        
        $today = Carbon::now()->toDateString();
        $todayAttendances = Attendance::where('date', $today)->count();
        
        $statuses = Attendance::select('status')
            ->selectRaw('count(*) as count')
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status')
            ->toArray();

        return response()->json([
            'data' => [
                'total_students' => $totalStudents,
                'total_attendances' => $totalAttendances,
                'today_attendances' => $todayAttendances,
                'statuses' => $statuses
            ]
        ]);
    }
}
