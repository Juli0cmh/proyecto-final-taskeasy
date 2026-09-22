<?php

use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Rutas públicas de autenticación
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas por Sanctum (Requieren token de autenticación)
Route::middleware('auth:sanctum')->group(function () {
    
    // Prueba de conexión
    Route::get('/prueba', function () {
        return response()->json([
            'mensaje' => 'API de Laravel funcionando',
            'estado' => true,
        ]);
    });

    // Gestión de Tareas
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::put('/tasks/{task}', [TaskController::class, 'update']);
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);

    // Gestión Administrativa de Usuarios
    Route::get('/admin/users', [UserController::class, 'index']);
    Route::put('/admin/users/{user}/role', [UserController::class, 'updateRole']);
    Route::delete('/admin/users/{user}', [UserController::class, 'destroy']);
});