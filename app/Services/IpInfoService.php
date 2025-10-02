<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class IpInfoService
{
    public static function getLocation($ip)
    {
        $token = env('IPINFO_TOKEN');

        // Kalau masih localhost 127.0.0.1 → pakai IP dummy biar bisa test
        if ($ip === '127.0.0.1' || $ip === '::1') {
            $ip = '8.8.8.8'; // Google DNS
        }

        $response = Http::get("https://ipinfo.io/{$ip}?token={$token}");

        if ($response->successful()) {
            return $response->json();
        }

        return null;
    }
}
