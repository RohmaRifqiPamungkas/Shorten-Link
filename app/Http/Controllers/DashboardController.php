<?php

namespace App\Http\Controllers;

use App\Models\ShortenedLink;
use App\Models\UrlClick;
use App\Models\Project;
use App\Models\Category;
use App\Models\ProjectClick;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        /**
         * === Shorten URL Stats ===
         */
        $totalLinks = ShortenedLink::where('user_id', $userId)->count();

        $totalClicks = UrlClick::whereHas('shortenedLink', fn($q) => $q->where('user_id', $userId))->count();

        $topLinks = ShortenedLink::where('user_id', $userId)
            ->withCount('clicks')
            ->orderByDesc('clicks_count')
            ->take(5)
            ->get();

        // klik per bulan (shorten link)
        $clicksPerMonthShorten = UrlClick::whereHas('shortenedLink', fn($q) => $q->where('user_id', $userId))
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        /**
         * === Project Stats ===
         */
        $totalProjects = Project::where('user_id', $userId)->count();

        $totalCategories = Category::whereHas('project', fn($q) => $q->where('user_id', $userId))->count();

        // Top projects by jumlah klik
        $topProjects = Project::where('user_id', $userId)
            ->withCount('clicks')
            ->orderByDesc('clicks_count')
            ->take(5)
            ->get();

        // klik per bulan (project)
        $clicksPerMonthProjects = ProjectClick::whereHas('project', fn($q) => $q->where('user_id', $userId))
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Klik berdasarkan negara (shorten link)
        $clicksByCountry = UrlClick::whereHas('shortenedLink', fn($q) => $q->where('user_id', $userId))
            ->selectRaw('country, COUNT(*) as total')
            ->groupBy('country')
            ->orderByDesc('total')
            ->get();

        return Inertia::render('Dashboard/Index', [
            // Shorten URL
            'totalLinks'           => $totalLinks,
            'totalClicks'          => $totalClicks,
            'topLinks'             => $topLinks,
            'clicksPerMonthShorten' => $clicksPerMonthShorten,

            // Project
            'totalProjects'        => $totalProjects,
            'totalCategories'      => $totalCategories,
            'topProjects'          => $topProjects,
            'clicksPerMonthProjects' => $clicksPerMonthProjects,

            // By Country (Shorten Link)
            'clicksByCountry'      => $clicksByCountry,
        ]);
    }
}
