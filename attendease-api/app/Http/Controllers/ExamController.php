<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    /**
     * Display a listing of the exams.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            // Get all exams with proper ordering
            $exams = Exam::orderBy('date', 'desc')
                ->orderBy('heure_debut', 'desc')
                ->get()
                ->map(function($exam) {
                    return [
                        'id' => $exam->id,
                        'name' => $exam->intitule, // Use intitule as name
                        'intitule' => $exam->intitule,
                        'date' => $exam->date->format('Y-m-d'),
                        'heure_debut' => $exam->heure_debut,
                        'heure_fin' => $exam->heure_fin,
                        'matiere' => $exam->matiere,
                        'filiere' => $exam->filiere,
                        'niveau' => $exam->niveau,
                        'groupe' => $exam->groupe,
                        'enseignant' => $exam->enseignant,
                        'salle' => $exam->salle,
                        'code' => $exam->code
                    ];
                });

            return response()->json($exams);
        } catch (\Exception $e) {
            Log::error('Error fetching exams: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to fetch exams',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
