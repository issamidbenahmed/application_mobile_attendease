<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ExamRoomController;
use App\Http\Controllers\ExamController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

// Routes pour les salles d'examen (publiques)
Route::apiResource('exam-rooms', ExamRoomController::class);

// Routes pour les examens (publiques)
Route::apiResource('exams', ExamController::class);

// Routes pour les étudiants
    Route::apiResource('/students', StudentController::class);
    Route::get('/students/search', [StudentController::class, 'search']);
    
    // Routes pour les présences
Route::get('/attendances', [AttendanceController::class, 'index']);
Route::get('/attendances/stats', [AttendanceController::class, 'stats']);
Route::get('/attendances/{attendance}', [AttendanceController::class, 'show']);
Route::put('/attendances/{attendance}', [AttendanceController::class, 'update']);
Route::delete('/attendances/{attendance}', [AttendanceController::class, 'destroy']);
    Route::post('/attendances/mark-by-code', [AttendanceController::class, 'markByCode']);

// Exam routes
Route::apiResource('exams', ExamController::class);