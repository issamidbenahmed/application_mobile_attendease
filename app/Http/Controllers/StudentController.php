<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        $students = Student::all();
        return JsonResource::collection($students);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'code_apogee' => 'required|string|max:50|unique:students',
            'cne' => 'required|string|max:50|unique:students',
            'email' => 'nullable|string|email|max:255',
            'classe' => 'nullable|string|max:100',
            'filiere' => 'nullable|string|max:100',
        ]);

        $student = Student::create($validated);

        return response()->json([
            'message' => 'Étudiant créé avec succès',
            'student' => new JsonResource($student)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student): JsonResource
    {
        return new JsonResource($student);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $student): JsonResponse
    {
        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'code_apogee' => 'sometimes|string|max:50|unique:students,code_apogee,' . $student->id,
            'cne' => 'sometimes|string|max:50|unique:students,cne,' . $student->id,
            'email' => 'nullable|string|email|max:255',
            'classe' => 'nullable|string|max:100',
            'filiere' => 'nullable|string|max:100',
        ]);

        $student->update($validated);

        return response()->json([
            'message' => 'Étudiant mis à jour avec succès',
            'student' => new JsonResource($student)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student): JsonResponse
    {
        $student->delete();

        return response()->json([
            'message' => 'Étudiant supprimé avec succès'
        ]);
    }
    
    /**
     * Search students by code apogee or CNE.
     */
    public function search(Request $request): AnonymousResourceCollection
    {
        $query = $request->input('query');
        
        $students = Student::where('code_apogee', 'like', "%{$query}%")
            ->orWhere('cne', 'like', "%{$query}%")
            ->orWhere('nom', 'like', "%{$query}%")
            ->orWhere('prenom', 'like', "%{$query}%")
            ->get();
            
        return JsonResource::collection($students);
    }
} 