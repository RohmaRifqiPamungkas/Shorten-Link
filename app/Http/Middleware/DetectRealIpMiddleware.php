<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class DetectRealIpMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Cloudflare
        if ($request->headers->has('CF-Connecting-IP')) {
            $request->server->set('REMOTE_ADDR', $request->header('CF-Connecting-IP'));
        }
        // Proxy / Load Balancer
        elseif ($request->headers->has('X-Forwarded-For')) {
            $ips = explode(',', $request->header('X-Forwarded-For'));
            $request->server->set('REMOTE_ADDR', trim($ips[0]));
        }

        return $next($request);
    }
}
