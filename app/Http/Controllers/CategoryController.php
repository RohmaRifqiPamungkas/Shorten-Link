<?php

namespace App\Http\Controllers;

use App\Models\Link;
use Inertia\Inertia;
use App\Models\Project;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Menampilkan semua kategori milik user untuk project tertentu
     */
    public function index(Request $request, $projectId)
    {
        $user = $request->user();

        $project = Project::find($projectId);

        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }

        $categories = Category::where('user_id', $user->id)
            ->where('project_id', $projectId)
            ->get();

        return response()->json($categories);
    }

    /**
     * Menampilkan form untuk membuat kategori baru
     */
    public function create(Request $request, $projectId)
    {
        $user = $request->user();

        $project = Project::where('id', $projectId)
            ->where('user_id', $user->id)
            ->firstOrFail();

        return Inertia::render('Projects/Categories/Create', [
            'project' => $project,
        ]);
    }

    /**
     * Menyimpan kategori baru
     */
    public function store(Request $request, $projectId)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $project = Project::where('id', $projectId)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $newName = strtolower(trim($request->name));

        // Ambil semua nama kategori dalam project ini
        $existingCategories = Category::where('user_id', $user->id)
            ->where('project_id', $project->id)
            ->pluck('name');

        foreach ($existingCategories as $existingName) {
            $distance = levenshtein($newName, strtolower($existingName));

            // Batas kemiripan yang ditoleransi (misalnya <= 2)
            if ($distance <= 2) {
                return response()->json([
                    'error' => "Nama kategori mirip dengan yang sudah ada: '{$existingName}' (selisih $distance karakter)."
                ], 422);
            }
        }

        $category = Category::create([
            'user_id' => $user->id,
            'project_id' => $project->id,
            'name' => $request->name,
        ]);

        return response()->json([
            'message' => 'Kategori berhasil dibuat',
            'category' => $category,
        ]);
    }
}