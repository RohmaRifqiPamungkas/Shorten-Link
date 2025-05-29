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

        $project = Project::where('id', $projectId)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $categories = Category::withCount('links')
            ->where('user_id', $user->id)
            ->where('project_id', $projectId)
            ->paginate(10);

        return Inertia::render('Projects/Categories/Index', [
            'project' => $project,
            'categories' => $categories,
        ]);
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
            if ($distance <= 2) {
                return back()->withErrors([
                    'name' => "Nama kategori mirip dengan yang sudah ada: '{$existingName}' (selisih $distance karakter)."
                ]);
            }
        }

        $category = Category::create([
            'user_id' => $user->id,
            'project_id' => $project->id,
            'name' => $request->name,
        ]);

        // Redirect ke halaman kategori project terkait
        return redirect()->route('projects.categories.index', $project->id)
            ->with('success', 'Kategori berhasil dibuat');
    }
}