<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Link;
use App\Models\Domain;
use App\Models\Project;
use App\Models\Category;
use Illuminate\Support\Str;
use App\Models\ProjectClick;
use Illuminate\Http\Request;
use App\Services\GroqService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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
        
        $domains = Domain::where('user_id', Auth::id())
            ->where('status', 'Active')
            ->get();
            
        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'domains' => $domains,
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
     * Generate Slug project.
     */
    public function generateSlug(Request $request, GroqService $groq)
    {
        $request->validate([
            'project_name' => 'required|string|max:255',
        ]);

        try {
            $slug = $groq->suggestSlug($request->project_name);

            return response()->json(['slug' => $slug]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Simpan project baru.
     */
    public function store(Request $request, GroqService $groq)
    {
        $request->validate([
            'project_name' => 'required|string|max:255',
            'project_slug' => [
                'nullable',
                'string',
                'max:255',
                'regex:/^[A-Za-z0-9\-_]+$/',
            ],
            'domain_id' => 'nullable|exists:domains,id',
        ], [
            'project_slug.regex' => 'Slug can only contain letters, numbers, dashes (-), or underscores (_), and no spaces.',
        ]);

        // Jika slug tidak diisi, generate random 4 karakter
        // $slug = $request->project_slug ?: Str::lower(Str::random(4));

        $slug = $request->project_slug;

        if (!$slug) {
            $aiSuggestion = $groq->suggestSlug($request->project_name);

            $slug = !empty($aiSuggestion)
                ? Str::slug($aiSuggestion, '-')
                : Str::lower(Str::random(4));
        }
        
        $allSlugs = Project::pluck('project_slug');
        foreach ($allSlugs as $existingSlug) {
            similar_text($slug, $existingSlug, $percent);
            $roundedPercent = round($percent); 
            if ($roundedPercent >= 100) {
                return back()->withErrors([
                    'project_slug' => "The project slug you entered is too similar to an existing slug ('{$existingSlug}'). Please choose a more distinct slug (similarity: {$roundedPercent}%)."
                ])->withInput();
            }
        }

        while (Project::where('project_slug', $slug)->exists()) {
            $slug = Str::slug($slug) . '-' . Str::lower(Str::random(4));
        }

        Project::create([
            'user_id' => Auth::id(),
            'domain_id'  => $request->domain_id,
            'project_name' => $request->project_name,
            'project_slug' => $slug,
            'is_active' => true,
            'password' => $request->filled('password') ? bcrypt($request->password) : null, 
        ]);

        return redirect()->route('projects.index')->with('success', 'Created Successfully.');
    }

    /**
     * Tampilkan form edit project.
     */
    public function edit($id): Response
    {
        $project = Project::findOrFail($id);

        $domains = Domain::where('user_id', Auth::id())
            ->where('status', 'Active')
            ->get();

        return Inertia::render('Projects/Edit', [
            'project' => $project,
            'domains' => $domains,
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
            'project_slug' => [
                'nullable',
                'string',
                'max:255',
                'regex:/^[A-Za-z0-9\-_]+$/',
                'unique:projects,project_slug,' . $project->id,
            ],
            'password' => 'nullable|string|min:8',
            'new_password' => 'nullable|string|min:8',
        ], [
            'project_slug.regex' => 'Slug can only contain letters, numbers, dashes (-), or underscores (_), and no spaces.',
        ]);

        $slug = $request->project_slug ?? Str::slug($request->project_name);

        // Validasi similar_text
        $allSlugs = Project::where('id', '!=', $project->id)->pluck('project_slug');
        foreach ($allSlugs as $existingSlug) {
            similar_text($slug, $existingSlug, $percent);
            $roundedPercent = round($percent); 
            if ($roundedPercent >= 100) {
                return back()->withErrors([
                    'project_slug' => "The project slug you entered is too similar to an existing slug ('{$existingSlug}'). Please choose a more distinct slug (similarity: {$roundedPercent}%)."
                ])->withInput();
            }
        }

        $updateData = [
            'project_name' => $request->project_name,
            'project_slug' => $slug,
            'domain_id'    => $request->domain_id, 
        ];

        // Password Handling
        if ($project->password) {
            if ($request->filled('new_password')) {
                if (!$request->filled('current_password')) {
                    return back()->withErrors([
                        'current_password' => 'Please provide current password to update.'
                    ]);
                }
                if (!\Hash::check($request->current_password, $project->password)) {
                    return back()->withErrors([
                        'current_password' => 'Current password is incorrect.'
                    ]);
                }
                $updateData['password'] = bcrypt($request->new_password);
            }
            // kalau new_password = "" → hapus proteksi
            elseif ($request->new_password === '') {
                $updateData['password'] = null;
            }
        } else {
            // project sebelumnya tidak ada password → boleh set langsung
            if ($request->filled('new_password')) {
                $updateData['password'] = bcrypt($request->new_password);
            }
        }

        $project->update($updateData);

        return redirect()->route('projects.index')->with('success', 'Updated Successfully.');
    }

    /**
     * Hapus project.
     */
    public function destroy($id)
    {
        $project = Project::findOrFail($id);

        // Ambil semua kategori dalam project
        $categories = Category::where('project_id', $project->id)->get();

        foreach ($categories as $category) {
            // Hapus gambar dari storage jika ada
            if ($category->image_url && Storage::disk('public')->exists($category->image_url)) {
                Storage::disk('public')->delete($category->image_url);
            }

            // Hapus semua link yang terkait dengan kategori ini
            Link::where('category_id', $category->id)->delete();

            // Hapus kategori itu sendiri
            $category->delete();
        }

        // Hapus semua link yang tidak punya kategori tapi masih terhubung ke project ini
        Link::where('project_id', $project->id)->delete();

        // Terakhir, hapus project
        $project->delete();

        return redirect()->route('projects.index')->with('success', 'Deleted Successfully.');
    }

    /**
     * Bulk Action project.
     */
    public function bulkDelete(Request $request)
    {
        dd($request->all());
        $ids = $request->input('ids', []);
        Project::whereIn('id', $ids)->where('user_id', Auth::id())->delete();

        return redirect()->route('projects.index')->with('success', 'Selected Deleted Successfully.');
    }
}