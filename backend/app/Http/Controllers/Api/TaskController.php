<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
{
    $user = $request->user();

    // Si es administrador, retorna todas las tareas del sistema con el usuario creador
    if ($user->role === 'admin') {
        return Task::with('user')->get();
    }

    // Si es un usuario normal, retorna solo sus propias tareas
    return Task::where('user_id', $user->id)->with('user')->get();
}

    public function store(Request $request)
{
    $request->validate([
        'title' => 'required|string|max:255',
        'priority' => 'nullable|string'
    ]);

    $task = Task::create([
        'user_id' => $request->user()->id, // Asocia la tarea al usuario autenticado
        'title' => $request->title,
        'priority' => $request->priority ?? 'Media',
        'completed' => false
    ]);

    return response()->json($task, 201);
}

    public function update(Request $request, Task $task)
    {
        $task->update($request->only(['title', 'completed', 'priority']));
        return response()->json($task);
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(['message' => 'Eliminado']);
    }
}

