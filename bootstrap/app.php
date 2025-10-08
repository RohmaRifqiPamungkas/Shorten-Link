<?php

use Illuminate\Foundation\Application;
use App\Http\Middleware\CheckCustomDomain;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            CheckCustomDomain::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\DetectRealIpMiddleware::class,
            \App\Http\Middleware\VerifyCsrfToken::class,
        ]);

    $middleware->alias([
        'guest' => \App\Http\Middleware\RedirectIfLoggedIn::class,
    ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();