<?php

namespace App\Http\Controllers;

use App\Models\ShortenedLink;
use App\Models\UrlClick;
use App\Services\IpInfoService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RedirectController extends Controller
{
    public function __invoke(Request $request, $code)
    {
        $domainId = $request->get('domain_id');

        $query = ShortenedLink::where(function ($q) use ($code) {
            $q->where('custom_alias', $code)
                ->orWhere('short_code', $code);
        });

        if ($domainId) {
            $query->where('domain_id', $domainId);
        } else {
            $query->whereNull('domain_id'); // fallback default APP_URL
        }

        $link = $query->first();

        // Tidak ada atau sudah expired
        if (!$link || ($link->expires_at && $link->expires_at->isPast())) {
            abort(404);
        }

        // Jika link ada password
        if ($link->password) {
            return Inertia::render('PasswordForm', [
                'short_code' => $code,
            ]);
        }

        // Ambil IP real user dari middleware
        $userIp = $request->ip();

        // Ambil lokasi IP
        $location = IpInfoService::getLocation($userIp);

        // Catat klik
        UrlClick::create([
            'shortened_link_id' => $link->id,
            'ip_address'        => $request->ip(),
            'user_agent'        => $request->userAgent(),
            'referer'           => $request->headers->get('referer'),
            'country'           => $location['country'] ?? 'Unknown',
        ]);

        // Redirect user
        return redirect()->away($link->original_url);
    }
}
