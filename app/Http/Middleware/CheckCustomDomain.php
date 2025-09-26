<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Domain;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckCustomDomain
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();

        $domain = Domain::where('domain', $host)->first();
        if ($domain) {
            $request->merge(['domain_id' => $domain->id]);
        }
        
        return $next($request);
    }
}
