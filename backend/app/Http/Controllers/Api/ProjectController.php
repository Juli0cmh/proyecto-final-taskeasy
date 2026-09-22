<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
class ProjectController extends Controller
{
 public function index(): JsonResponse
 {
 return response()->json(Project::latest()->get());
 }
 public function store(Request $request): JsonResponse
 {
 $data = $request->validate([
 'title_es' => ['required', 'string', 'max:150'],
 'title_en' => ['required', 'string', 'max:150'],
 'description_es' => ['nullable', 'string'],
 'description_en' => ['nullable', 'string'],
 'image' => ['nullable', 'url', 'max:255'],
 'url' => ['nullable', 'url', 'max:255'],
 ]);
 $project = Project::create($data);
 return response()->json($project, 201);
 }
 public function show(Project $project): JsonResponse
 {
 return response()->json($project);
 }
 public function update(Request $request, Project $project): JsonResponse
 {
 $data = $request->validate([
 'title_es' => ['sometimes', 'required', 'string', 'max:150'],
 'title_en' => ['sometimes', 'required', 'string', 'max:150'],
 'description_es' => ['nullable', 'string'],
 'description_en' => ['nullable', 'string'],
 'image' => ['nullable', 'url', 'max:255'],
 'url' => ['nullable', 'url', 'max:255'],
 ]);
 $project->update($data);
 return response()->json($project);
 }
 public function destroy(Project $project): JsonResponse
 {
 $project->delete();
 return response()->json(['message' => 'Proyecto eliminado']);
 }
}