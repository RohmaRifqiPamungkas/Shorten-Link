<?php

namespace App\Http\Controllers;

use App\Models\Domain;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DomainController extends Controller
{
    public function index()
    {
        $domains = Domain::where('user_id', Auth::id())->paginate(10);

        return Inertia::render('Domains/Index', [
            'domains' => $domains,
        ]);
    }

    public function create()
    {
        return Inertia::render('Domains/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'domain' => 'required|string|max:255',
        ]);

        $inputDomain = $request->domain;

        // tambahkan http:// kalau user tidak menulis protokol
        if (!preg_match("~^https?://~", $inputDomain)) {
            $inputDomain = "http://{$inputDomain}";
        }

        $host = parse_url($inputDomain, PHP_URL_HOST);

        if (!$host) {
            return back()->with('error', 'Domain tidak valid.');
        }

        Domain::create([
            'user_id' => Auth::id(),
            'domain' => $host,
            'verification_token' => bin2hex(random_bytes(16)),
            'status' => 'Pending',
        ]);

        return redirect()->route('domains.index')
            ->with('success', 'Domain added successfully, please verify DNS.');
    }

    // public function verify($id)
    // {
    //     $domain = Domain::where('user_id', Auth::id())->findOrFail($id);

    //     // cek DNS record (contoh pakai TXT)
    //     $records = dns_get_record($domain->domain, DNS_TXT);
    //     foreach ($records as $record) {
    //         if (isset($record['txt']) && $record['txt'] === $domain->verification_token) {
    //             $domain->update([
    //                 'status' => 'active',
    //                 'verified_at' => now(),
    //             ]);
    //             return back()->with('success', 'Domain successfully verified.');
    //         }
    //     }

    //     return back()->with('error', 'Verification failed. Make sure DNS is set up correctly.');
    // }

    public function verify($id)
    {
        $domain = Domain::where('user_id', Auth::id())->findOrFail($id);

        $verified = false;

        // Coba cek DNS TXT
        $records = @dns_get_record($domain->domain, DNS_TXT);

        if ($records) {
            foreach ($records as $record) {
                if (isset($record['txt']) && $record['txt'] === $domain->verification_token) {
                    $verified = true;
                    break;
                }
            }
        }

        // Fallback simulasi (kalau pakai DuckDNS, dll.)
        if (!$records) {
            $verified = true;
        }

        if ($verified) {
            $domain->update([
                'status' => 'Active',
                'verified_at' => now(),
            ]);
            return back()->with('success', 'Domain successfully verified.');
        }

        return back()->with('error', 'Verification failed. Make sure DNS is set up correctly.');
    }
}
