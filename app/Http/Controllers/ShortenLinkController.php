<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\ShortenedLink;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class ShortenLinkController extends Controller
{
    protected $baseUrl = 'http://localhost:8000/s/';

    public function index()
    {
        $perPage = request('perPage', 10);
        $search = request('search');
        
        $query = ShortenedLink::where('user_id', Auth::id());
        
        if ($search) {
            $query->where('short_code', 'like', "%{$search}%");
        }

        $shortends = $query->latest()
            ->paginate($perPage)
            ->appends(request()->query());

        return Inertia::render('Shorten/Index', [
            'shortends' => $shortends,
            'success' => session('success'),
        ]);
    }

    public function create()
    {
        return inertia('Shorten/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'original_url' => 'required|url',
            'custom_alias' => 'nullable|string|alpha_dash|unique:shortened_links,custom_alias',
            'expires_at' => 'nullable|date|after:' . now()->addMinute(),
        ]);

        $alias = $request->custom_alias ?? Str::random(6);

        $expiresAt = $request->filled('expires_at')
            ? Carbon::parse($request->expires_at)->endOfDay()
            : null;

        $link = ShortenedLink::create([
            'user_id'      => Auth::id(),
            'original_url' => $request->original_url,
            'short_code'   => $alias,
            'custom_alias' => $request->custom_alias,
            'expires_at'   => $expiresAt,
        ]);

        return redirect()->route('shorten.index')->with('success', 'Link berhasil dipendekkan!');
    }

    public function edit($id)
    {
        $link = ShortenedLink::where('user_id', Auth::id())->findOrFail($id);

        return Inertia::render('Shorten/Edit', [
            'link' => $link,
        ]);
    }

    public function update(Request $request, $id)
    {
        $link = ShortenedLink::where('user_id', Auth::id())->findOrFail($id);

        $request->validate([
            'original_url' => 'required|url',
            'custom_alias' => [
                'nullable',
                'string',
                'alpha_dash',
                Rule::unique('shortened_links', 'custom_alias')->ignore($link->id),
            ],
            'expires_at' => 'nullable|date|after:' . now()->addMinute(),
        ]);

        $expiresAt = $request->filled('expires_at')
            ? Carbon::parse($request->expires_at)->endOfDay()
            : null;

        $link->update([
            'original_url' => $request->original_url,
            'custom_alias' => $request->custom_alias,
            'short_code'   => $request->custom_alias ?? $link->short_code,
            'expires_at'   => $expiresAt,
        ]);

        return redirect()->route('shorten.index')->with('success', 'Link berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $link = ShortenedLink::where('user_id', Auth::id())->findOrFail($id);
        $link->delete();

        return redirect()
            ->route('shorten.index')
            ->with('success', 'Shorten URL deleted successfully.');
    }

    public function redirect($code)
    {
        $link = ShortenedLink::where('custom_alias', $code)
            ->orWhere('short_code', $code)
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->firstOrFail();

        return redirect()->away($link->original_url);
    }
}