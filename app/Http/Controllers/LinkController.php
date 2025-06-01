<?php

namespace App\Http\Controllers;

use App\Models\Link;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Project;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class LinkController extends Controller
{
    public function indexByCategory(Request $request, $projectId, $categoryId)
    {
        $project = Project::findOrFail($projectId);
        $category = Category::findOrFail($categoryId);

        $perPage = $request->query('perPage', 10);

        $links = Link::with('category')
            ->where('project_id', $projectId)
            ->where('category_id', $categoryId)
            ->latest()
            ->paginate($perPage)
            ->appends(['perPage' => $perPage]);

        $categories = Category::where('project_id', $projectId)->get();

        return Inertia::render('Projects/Links/Index', [
            'auth' => [
                'user' => Auth::user()
            ],
            'project' => $project,
            'category' => $category,
            'links' => $links,
            'categories' => $categories,
        ]);
    }

    public function index(Project $project)
    {
        $perPage = request()->query('perPage', 10);

        $links = $project->links()->with('category')->latest()->paginate($perPage);
        $categories = $project->categories;

        return Inertia::render('Projects/Links/Index', [
            'auth' => [
                'user' => Auth::user()
            ],
            'project' => $project,
            'links' => $links,
            'categories' => $categories,
        ]);
    }
    
    public function create(Request $request, Project $project): Response
    {
        abort_if($project->user_id !== Auth::id(), 403);

        $categoryId = $request->query('category_id');

        return Inertia::render('Projects/Links/Create', [
            'project' => $project,
            'categories' => $project->categories,
            'selectedCategoryId' => $categoryId,
        ]);
    }

    public function store(Request $request, Project $project): RedirectResponse
    {
        abort_if($project->user_id !== Auth::id(), 403);

        // Validasi form untuk link yang akan ditambahkan
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'links' => 'required|array|min:1',
            'links.*.title' => 'required|string|max:255',
            'links.*.url' => 'required|url',
        ]);

        $userId = Auth::id();

        foreach ($validated['links'] as $link) {
            $project->links()->create([
                'user_id' => $userId,
                'category_id' => $validated['category_id'],
                'parent_id' => null,
                'title' => $link['title'],
                'original_url' => $link['url'],
            ]);
        }

        return redirect()
            ->route('projects.links.index', $project->id)
            ->with('success', 'Link berhasil ditambahkan.');
    }

    public function destroy(Link $link): RedirectResponse
    {
        if ($link->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $project_id = $link->project_id;
        $link->delete();

        return redirect()
            ->route('projects.links.index', $project_id)
            ->with('success', 'Link berhasil dihapus.');
    }
}