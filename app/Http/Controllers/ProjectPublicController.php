<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectClick;
use App\Services\IpInfoService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectPublicController extends Controller
{
    public function showBySlug(Request $request, $slug)
    {
        $project = Project::where('project_slug', $slug)->firstOrFail();

        // Password protection
        if ($project->password && !$request->session()->has("project_access_{$project->id}")) {
            return Inertia::render('PasswordForm', [
                'project_slug' => $project->project_slug,
            ]);
        }

        // Catat klik
        $userIp = $request->ip();
        $location = IpInfoService::getLocation($userIp);

        ProjectClick::create([
            'project_id' => $project->id,
            'ip_address' => $userIp,
            'user_agent' => $request->userAgent(),
            'referer'    => $request->headers->get('referer'),
            'country'    => $location['country'] ?? 'Unknown',
        ]);

        // Ambil link & kategori project
        $mainLinks = $project->links()
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->with(['children' => fn($q) => $q->where('is_active', true), 'category'])
            ->get();

        $grouped = $mainLinks->groupBy(fn($link) => optional($link->category)->name ?? 'Uncategorized')
            ->map(function ($links, $categoryName) {
                $categoryImage = optional($links->first()->category)->image_url;
                return [
                    'category' => $categoryName,
                    'image_url' => $categoryImage,
                    'links' => $links->map(fn($link) => [
                        'id' => $link->id,
                        'title' => $link->title,
                        'original_url' => $link->original_url,
                        'children' => $link->children->map(fn($child) => [
                            'title' => $child->title,
                            'original_url' => $child->original_url,
                        ])->values()
                    ])->values()
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

    public function verifyPassword(Request $request, $slug)
    {
        $project = Project::where('project_slug', $slug)->firstOrFail();

        $request->validate(['password' => 'required|string']);

        if (!\Hash::check($request->password, $project->password)) {
            return response()->json(['error' => 'Password is incorrect.'], 422);
        }

        $request->session()->put("project_access_{$project->id}", true);

        return response()->json([
            'success' => true,
            'url' => route('projects.showBySlug', $project->project_slug),
        ]);
    }
}
