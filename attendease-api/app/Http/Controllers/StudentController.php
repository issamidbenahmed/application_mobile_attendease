<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $students = Student::all();
        return response()->json(['data' => $students]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'code_apogee' => 'required|string|unique:students|max:50',
            'cne' => 'required|string|unique:students|max:50',
            'email' => 'required|email|unique:students',
            'filiere' => 'required|string|max:100',
            'niveau' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $student = Student::create($request->all());
        return response()->json([
            'message' => 'Étudiant créé avec succès',
            'data' => $student
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $student = Student::find($id);
        
        if (!$student) {
            return response()->json([
                'message' => 'Étudiant non trouvé'
            ], 404);
        }

        return response()->json(['data' => $student]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $student = Student::find($id);
        
        if (!$student) {
            return response()->json([
                'message' => 'Étudiant non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'string|max:100',
            'prenom' => 'string|max:100',
            'code_apogee' => 'string|max:50|unique:students,code_apogee,' . $id,
            'cne' => 'string|max:50|unique:students,cne,' . $id,
            'email' => 'email|unique:students,email,' . $id,
            'filiere' => 'string|max:100',
            'niveau' => 'string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $student->update($request->all());

        return response()->json([
            'message' => 'Étudiant mis à jour avec succès',
            'data' => $student
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $student = Student::find($id);
        
        if (!$student) {
            return response()->json([
                'message' => 'Étudiant non trouvé'
            ], 404);
        }

        $student->delete();

        return response()->json([
            'message' => 'Étudiant supprimé avec succès'
        ]);
    }

    /**
     * Search students by name, code_apogee, or cne.
     */
    public function search(Request $request)
    {
        $query = $request->get('q');
        
        if (!$query) {
            return response()->json([
                'message' => 'Paramètre de recherche manquant'
            ], 400);
        }

        $students = Student::where('nom', 'LIKE', "%{$query}%")
            ->orWhere('prenom', 'LIKE', "%{$query}%")
            ->orWhere('code_apogee', 'LIKE', "%{$query}%")
            ->orWhere('cne', 'LIKE', "%{$query}%")
            ->get();

        return response()->json(['data' => $students]);
    }
}
