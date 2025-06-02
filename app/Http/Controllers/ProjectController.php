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
        $perPage = request('perPage', 10);
        $search = request('search');

        $query = Project::where('user_id', Auth::id());

        if ($search) {
            $query->where('project_name', 'like', "%{$search}%");
        }

        $projects = $query->latest()
            ->paginate($perPage)
            ->appends(request()->query());

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
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
            'project_slug' => [
                'nullable',
                'string',
                'max:255',
                'regex:/^[A-Za-z0-9\-_]+$/',
            ],
        ], [
            'project_slug.regex' => 'Slug can only contain letters, numbers, dashes (-), or underscores (_), and no spaces.',
        ]);

        // Jika slug tidak diisi, generate random 4 karakter
        $slug = $request->project_slug ?: Str::lower(Str::random(4));

        // Validasi slug levenshtein
        $allSlugs = Project::pluck('project_slug');
        foreach ($allSlugs as $existingSlug) {
            $distance = levenshtein($slug, $existingSlug);
            if ($distance <= 2) {
                return back()->withErrors([
                    'project_slug' => "The project slug you entered is too similar to an existing slug ('{$existingSlug}'). Please choose a more distinct slug (difference: $distance character(s))."
                ])->withInput();
            }
        }

        while (Project::where('project_slug', $slug)->exists()) {
            $slug = $request->project_slug
                ? Str::slug($request->project_slug) . '-' . Str::random(4)
                : Str::lower(Str::random(4));
        }

        Project::create([
            'user_id' => Auth::id(),
            'project_name' => $request->project_name,
            'project_slug' => $slug,
            'is_active' => true,
        ]);

        return redirect()->route('projects.index')->with('success', 'Created Successfully.');
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

        return redirect()->route('projects.index')->with('success', 'Created Successfully.');
    }

    /**
     * Hapus project.
     */
    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return redirect()->route('projects.index')->with('success', 'Deleted Successfully.');
    }

    /**
     * Bulk Action project.
     */
    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);
        Project::whereIn('id', $ids)->where('user_id', Auth::id())->delete();

        return redirect()->route('projects.index')->with('success', 'Selected Deleted Successfully.');
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
            return optional($link->category)->name ?? 'Uncategorized';
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