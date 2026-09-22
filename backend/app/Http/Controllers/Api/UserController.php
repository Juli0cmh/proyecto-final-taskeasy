<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Listar todos los usuarios con el conteo de sus tareas
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        // Retorna los usuarios junto con sus tareas para calcular estadísticas
        return User::withCount('tasks')->get();
    }

    // Actualizar el rol de un usuario (ej. de 'user' a 'admin' o bloquear cambiando a 'blocked')
    public function updateRole(Request $request, User $user)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'role' => 'required|in:user,admin,blocked'
        ]);

        $user->role = $request->role;
        $user->save();

        return response()->json(['message' => 'Rol de usuario actualizado con éxito', 'user' => $user]);
    }

    // Eliminar o bloquear un usuario del sistema
    public function destroy(Request $request, User $user)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        // Evitar que el admin se borre a sí mismo
        if ($request->user()->id === $user->id) {
            return response()->json(['message' => 'No puedes eliminar tu propia cuenta de administrador'], 400);
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado correctamente']);
    }
}