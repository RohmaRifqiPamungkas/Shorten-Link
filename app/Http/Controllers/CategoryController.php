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

        $perPage = $request->query('perPage', 10);
        $search = $request->query('search');

        $project = Project::where('id', $projectId)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $query = Category::withCount('links')
            ->where('user_id', $user->id)
            ->where('project_id', $projectId);

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $categories = $query->paginate($perPage)->appends($request->query());

        return Inertia::render('Projects/Categories/Index', [
            'project' => $project,
            'categories' => $categories,
            'success' => session('success'),
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

        // foreach ($existingCategories as $existingName) {
        //     $distance = levenshtein($newName, strtolower($existingName));
        //     if ($distance <= 2) {
        //         return back()->withErrors([
        //             'name' => "Category name is too similar to an existing one: '{$existingName}' (difference of $distance character(s))."
        //         ]);
        //     }
        // }

        foreach ($existingCategories as $existingName) {
            similar_text($newName, strtolower($existingName), $percent);
            $roundedPercent = round($percent);
            if ($percent >= 80) {
                return back()->withErrors([
                    'name' => "Category name is too similar to an existing one: '{$existingName}' ({$roundedPercent}% similarity)."
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
            ->with('success', 'Created Succesfully.');
    }
    
    public function update(Request $request, $projectId, $categoryId)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $project = Project::where('id', $projectId)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $category = Category::where('id', $categoryId)
            ->where('user_id', $user->id)
            ->where('project_id', $project->id)
            ->firstOrFail();

        $newName = strtolower(trim($request->name));

        // Cek kemiripan nama kategori lain (kecuali dirinya sendiri)
        $existingCategories = Category::where('user_id', $user->id)
            ->where('project_id', $project->id)
            ->where('id', '!=', $category->id)
            ->pluck('name');

        // foreach ($existingCategories as $existingName) {
        //     $distance = levenshtein($newName, strtolower($existingName));
        //     if ($distance <= 2) {
        //         return back()->withErrors([
        //             'name' => "The categories you entered is too similar to an existing slug ('{$existingName}'). Please choose a more distinct slug (difference: $distance character(s))."
        //         ]);
        //     }
        // }

        foreach ($existingCategories as $existingName) {
            similar_text($newName, strtolower($existingName), $percent);
            $roundedPercent = round($percent);
            if ($roundedPercent >= 80) {
                return back()->withErrors([
                    'name' => "Category name is too similar to an existing one: '{$existingName}' ({$roundedPercent}% similarity)."
                ])->withInput();
            }
        }

        $category->name = $request->name;
        $category->save();

        return redirect()->route('projects.categories.index', $project->id)
            ->with('success', 'Update Successfully.');
    }

    public function destroy(Request $request, $projectId, $categoryId)
    {
        $user = $request->user();

        $project = Project::where('id', $projectId)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $category = Category::where('id', $categoryId)
            ->where('user_id', $user->id)
            ->where('project_id', $project->id)
            ->firstOrFail();

        $category->delete();

        return redirect()
            ->route('projects.categories.index', $project->id)
            ->with('success', 'Deleted Successfully.');
    }
}