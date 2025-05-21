<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $students = [
            [
                'nom' => 'Doe',
                'prenom' => 'John',
                'code_apogee' => 'AP001',
                'cne' => 'CNE001',
                'email' => 'john.doe@example.com',
                'filiere' => 'Informatique',
                'niveau' => 'L3',
                'cin' => 'CIN001'
            ],
            [
                'nom' => 'Smith',
                'prenom' => 'Jane',
                'code_apogee' => 'AP002',
                'cne' => 'CNE002',
                'email' => 'jane.smith@example.com',
                'filiere' => 'Informatique',
                'niveau' => 'L3',
                'cin' => 'CIN002'
            ],
            [
                'nom' => 'Ali',
                'prenom' => 'Mohammed',
                'code_apogee' => 'AP003',
                'cne' => 'CNE003',
                'email' => 'mohammed.ali@example.com',
                'filiere' => 'Informatique',
                'niveau' => 'L3',
                'cin' => 'CIN003'
            ]
        ];

        foreach ($students as $student) {
            Student::create($student);
        }
    }
} 