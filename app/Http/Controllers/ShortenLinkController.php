<?php

namespace App\Http\Controllers;

use Hash;
use Inertia\Inertia;
use App\Models\Domain;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\ShortenedLink;
use App\Services\GroqService;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class ShortenLinkController extends Controller
{
    protected $baseUrl = 'http://localhost:8000/s/';

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function index()
    {
        $perPage = request('perPage', 10);
        $search = request('search');

        $query = ShortenedLink::with('domain')
            ->withCount('clicks')
            ->where('user_id', Auth::id());
        
        if ($search) {
            $query->where('short_code', 'like', "%{$search}%");
        }

        $shortends = $query->latest()
            ->paginate($perPage)
            ->appends(request()->query());

        $domains = Domain::where('user_id', Auth::id())
            ->where('status', 'Active')
            ->get();

        return Inertia::render('Shorten/Index', [
            'shortends' => $shortends,
            'domains'   => $domains,
        ]);
    }

    public function create()
    {
        return Inertia::render('Shorten/Create', [
        ]);
    }

    public function generateSlug(Request $request, GroqService $groq)
    {
        $request->validate([
            'url' => 'required|url',
        ]);

        try {
            $aiSuggestion = $groq->suggestSlug($request->url);

            $slug = !empty($aiSuggestion)
                ? Str::slug($aiSuggestion, '-')
                : Str::random(6);

            return response()->json(['slug' => $slug]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request, GroqService $groq)
    {
        $request->validate([
            'original_url' => 'required|url',
            'custom_alias' => [
                'nullable',
                'string',
                'regex:/^[A-Za-z0-9\-_]+$/',
            ],
            'expires_at' => 'required|date|after:' . now()->addMinute(),
            'domain_id' => 'nullable|exists:domains,id',
        ], [
            'custom_alias.regex' => 'Alias can only contain letters, numbers, dashes (-), or underscores (_), no spaces.',
        ]);

        // kalau user tidak isi custom_alias, generate via AI
        $alias = $request->custom_alias;
        if (!$alias) {
            $aiSuggestion = $groq->suggestSlug($request->original_url);

            // fallback kalau AI kosong
            $alias = !empty($aiSuggestion)
                ? Str::slug($aiSuggestion, '-') // rapikan format
                : Str::random(6);
        }

        // cek alias tidak bentrok
        $allAliases = ShortenedLink::pluck('custom_alias')->filter();
        foreach ($allAliases as $existingAlias) {
            similar_text($alias, $existingAlias, $percent);
            $roundedPercent = round($percent);
            if ($roundedPercent >= 100) {
                return back()->withErrors([
                    'custom_alias' => "The alias '{$alias}' is too similar to an existing alias ('{$existingAlias}'). Please choose another."
                ])->withInput();
            }
        }

        $expiresAt = $request->filled('expires_at')
            ? Carbon::parse($request->expires_at)->endOfDay()
            : null;

        $link = ShortenedLink::create([
            'user_id'      => Auth::id(),
            'domain_id'    => $request->domain_id,
            'original_url' => $request->original_url,
            'short_code'   => $alias,
            'custom_alias' => $alias,
            'expires_at'   => $expiresAt,
            'password'     => $request->filled('password') ? bcrypt($request->password) : null,
        ]);

        return redirect()->route('shorten.index')->with('success', 'Created Successfully.');
    }

    public function edit($id)
    {
        $link = ShortenedLink::with('domain')
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        $domains = Domain::where('user_id', Auth::id())
            ->where('status', 'Active')
            ->get();

        return Inertia::render('Shorten/Edit', [
            'link' => $link,
            'domains' => $domains,
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
            'expires_at'        => 'required|date|after:' . now()->addMinute(),
            'current_password'  => 'nullable|string',
            'new_password'      => 'nullable|string|min:8',
        ]);

        $alias = $request->custom_alias;

        // Cek kemiripan alias dengan existing alias lain (kecuali dirinya sendiri)
        if ($alias) {
            $allAliases = ShortenedLink::where('id', '!=', $link->id)
                ->whereNotNull('custom_alias')
                ->pluck('custom_alias');

            foreach ($allAliases as $existingAlias) {
                similar_text($alias, $existingAlias, $percent);
                $roundedPercent = round($percent);
                if ($roundedPercent >= 100) {
                    return back()->withErrors([
                        'custom_alias' => "The custom alias you entered is too similar to an existing alias ('{$existingAlias}'). Please choose a more distinct alias (similarity: {$roundedPercent}%)."
                    ])->withInput();
                }
            }
        }

        $expiresAt = $request->filled('expires_at')
            ? Carbon::parse($request->expires_at)->endOfDay()
            : null;

        $updateData = [
            'original_url' => $request->original_url,
            'custom_alias' => $alias,
            'short_code'   => $alias ?? $link->short_code,
            'expires_at'   => $expiresAt,
            'domain_id'    => $request->domain_id,
        ];

        if ($link->password) {
            if ($request->filled('new_password')) {
                if (!$request->filled('current_password')) {
                    return back()->withErrors(['current_password' => 'Please provide current password to update.']);
                }
                if (!\Hash::check($request->current_password, $link->password)) {
                    return back()->withErrors(['current_password' => 'Current password is incorrect.']);
                }
                $updateData['password'] = bcrypt($request->new_password);
            }
            // kalau new_password = "" (string kosong) → hapus proteksi
            elseif ($request->new_password === '') {
                $updateData['password'] = null;
            }
        } else {
            // link sebelumnya tidak ada password → boleh set langsung
            if ($request->filled('new_password')) {
                $updateData['password'] = bcrypt($request->new_password);
            }
        }

        $link->update($updateData);

        return redirect()->route('shorten.index')->with('success', 'Updated Successfully.');
    }

    public function destroy($id)
    {
        $link = ShortenedLink::where('user_id', Auth::id())->findOrFail($id);
        $link->delete();

        return redirect()
            ->route('shorten.index')
            ->with('success', 'Deleted Successfully.');
    }

    public function validatePassword(Request $request)
    {
        $request->validate([
            'short_code' => 'required|string',
            'password'   => 'required|string',
        ]);

        $link = ShortenedLink::where('short_code', $request->short_code)
            ->orWhere('custom_alias', $request->short_code)
            ->firstOrFail();

        if (!\Hash::check($request->password, $link->password)) {
            return response()->json(['error' => 'Password failed!'], 422);
        }

        return response()->json([
            'success' => true,
            'url' => $link->original_url,
        ]);
    }
}