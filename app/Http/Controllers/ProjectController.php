<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Menampilkan daftar project milik user.
     */
    public function index(): Response
    {
        $projects = Project::where('user_id', Auth::id())
            ->latest()
            ->paginate(10);

        $success = session('success');

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'success' => $success,
        ]);
    }

    /**
     * Menampilkan form create project.
     */
    public function create(): Response
    {
        return Inertia::render('Projects/Create');
    }

    /**
     * Simpan project baru.
     */
    public function store(Request $request)
    {
        $request->validate([
            'project_name' => 'required|string|max:255',
            'project_slug' => 'nullable|string|max:255',
        ]);

        $slug = $request->project_slug ?? Str::slug($request->project_name);

        // Validasi slug mirip (custom)
        $allSlugs = Project::pluck('project_slug');
        foreach ($allSlugs as $existingSlug) {
            similar_text($slug, $existingSlug, $percent); // atau pakai levenshtein
            if ($percent >= 85) {
                return back()->withErrors(['project_slug' => 'Slug terlalu mirip dengan slug yang sudah ada: ' . $existingSlug])->withInput();
            }
        }

        // Jamin tetap unik slug-nya
        while (Project::where('project_slug', $slug)->exists()) {
            $slug = Str::slug($request->project_name) . '-' . Str::random(4);
        }

        Project::create([
            'user_id' => Auth::id(),
            'project_name' => $request->project_name,
            'project_slug' => $slug,
            'is_active' => true,
        ]);

        return redirect()->route('projects.index')->with('success', 'Project berhasil dibuat!');
    }

    /**
     * Tampilkan form edit project.
     */
    public function edit($id): Response
    {
        $project = Project::findOrFail($id);

        return Inertia::render('Projects/Edit', [
            'project' => $project,
        ]);
    }

    /**
     * Update data project.
     */
    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $request->validate([
            'project_name' => 'required|string|max:255',
            'project_slug' => 'nullable|string|max:255|unique:projects,project_slug,' . $project->id,
        ]);

        $project->update([
            'project_name' => $request->project_name,
            'project_slug' => $request->project_slug ?? Str::slug($request->project_name),
        ]);

        return redirect()->route('projects.index')->with('success', 'Project berhasil diperbarui.');
    }

    /**
     * Hapus project.
     */
    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return redirect()->route('projects.index')->with('success', 'Project deleted successfully.');
    }

    /**
     * Menampilkan halaman publik berdasarkan slug project.
     */
    public function showBySlug($slug)
    {
        $project = Project::where('project_slug', $slug)->firstOrFail();

        $mainLinks = $project->links()
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->with([
                'children' => function ($query) {
                    $query->where('is_active', true);
                },
                'category'
            ])
            ->get();

        $grouped = $mainLinks->groupBy(function ($link) {
            return optional($link->category)->name ?? 'Tanpa Kategori';
        })->map(function ($links, $categoryName) {
            return [
                'category' => $categoryName,
                'links' => $links->map(function ($link) {
                    return [
                        'id' => $link->id,
                        'title' => $link->title,
                        'original_url' => $link->original_url,
                        'children' => $link->children->map(function ($child) {
                            return [
                                'title' => $child->title,
                                'original_url' => $child->original_url,
                            ];
                        })->values()
                    ];
                })->values()
            ];
        })->values();

        return Inertia::render('Projects/PublicView', [
            'project' => [
                'id' => $project->id,
                'name' => $project->project_name,
                'slug' => $project->project_slug,
            ],
            'categories' => $grouped,
        ]);
    }
}