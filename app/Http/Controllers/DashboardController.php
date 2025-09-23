<?php

namespace App\Http\Controllers;

use App\Models\ShortenedLink;
use App\Models\UrlClick;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $totalLinks = ShortenedLink::where('user_id', $userId)->count();
        $totalClicks = UrlClick::whereHas('shortenedLink', fn($q) => $q->where('user_id', $userId))->count();

        $topLinks = ShortenedLink::where('user_id', $userId)
            ->withCount('clicks')
            ->orderByDesc('clicks_count')
            ->take(5)
            ->get();

        $clicksPerDay = UrlClick::whereHas('shortenedLink', fn($q) => $q->where('user_id', $userId))
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return Inertia::render('Dashboard/Index', [
            'totalLinks'   => $totalLinks,
            'totalClicks'  => $totalClicks,
            'topLinks'     => $topLinks,
            'clicksPerDay' => $clicksPerDay,
        ]);
    }
}
