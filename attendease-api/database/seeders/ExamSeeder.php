<?php

namespace Database\Seeders;

use App\Models\Exam;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class ExamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $exams = [
            [
                'code' => 'ALGO-2024-001',
                'intitule' => 'Examen d\'Algorithmique Avancée',
                'date' => Carbon::now()->addDays(3),
                'heure_debut' => '09:00:00',
                'heure_fin' => '12:00:00',
                'filiere' => 'Informatique',
                'niveau' => 'Licence 3',
                'groupe' => 'G1',
                'matiere' => 'Algorithmique Avancée',
                'enseignant' => 'Dr. Martin',
                'salle' => 'A101'
            ],
            [
                'code' => 'WEB-2024-001',
                'intitule' => 'Examen de Développement Web',
                'date' => Carbon::now()->addDays(5),
                'heure_debut' => '14:00:00',
                'heure_fin' => '17:00:00',
                'filiere' => 'Informatique',
                'niveau' => 'Licence 3',
                'groupe' => 'G1',
                'matiere' => 'Développement Web Moderne',
                'enseignant' => 'Mme. Dubois',
                'salle' => 'B203'
            ],
            [
                'code' => 'IA-2024-001',
                'intitule' => 'Examen d\'Intelligence Artificielle',
                'date' => Carbon::now()->addDays(7),
                'heure_debut' => '09:00:00',
                'heure_fin' => '12:00:00',
                'filiere' => 'Informatique',
                'niveau' => 'Master 1',
                'groupe' => 'M1',
                'matiere' => 'IA et Machine Learning',
                'enseignant' => 'Pr. Zhang',
                'salle' => 'C305'
            ],
            [
                'code' => 'BD-2024-001',
                'intitule' => 'Examen de Bases de Données',
                'date' => Carbon::now()->addDays(10),
                'heure_debut' => '14:00:00',
                'heure_fin' => '17:00:00',
                'filiere' => 'Informatique',
                'niveau' => 'Licence 2',
                'groupe' => 'G2',
                'matiere' => 'Bases de Données Avancées',
                'enseignant' => 'Dr. Lefebvre',
                'salle' => 'A201'
            ],
            [
                'code' => 'SECU-2024-001',
                'intitule' => 'Examen de Sécurité Informatique',
                'date' => Carbon::now()->addDays(12),
                'heure_debut' => '09:00:00',
                'heure_fin' => '12:00:00',
                'filiere' => 'Informatique',
                'niveau' => 'Master 2',
                'groupe' => 'M2',
                'matiere' => 'Sécurité des Systèmes',
                'enseignant' => 'Dr. Müller',
                'salle' => 'D104'
            ]
        ];

        foreach ($exams as $exam) {
            Exam::create($exam);
        }
    }
}
