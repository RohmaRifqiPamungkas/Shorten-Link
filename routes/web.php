<?php

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ShortenLinkController;
// use App\Http\Controllers\Auth\VerifyEmailController;
// use Symfony\Component\HttpKernel\Exception\HttpException;

// =====================================
// Test Errors Routes
// =====================================

// Route::get('/test-error/{code}', function ($code) {
//     switch ($code) {
//         case 401:
//             abort(401);
//         case 402:
//             throw new HttpException(402);
//         case 403:
//             abort(403, 'Access denied.');
//         case 419:
//             abort(419);
//         case 429:
//             abort(429);
//         case 500:
//             abort(500);
//         case 503:
//             abort(503);
//         default:
//             abort(404);
//     }
// });

// Route::get('/db-error', function () {
//     \DB::table('tabel_yang_tidak_ada')->get(); // trigger SQL error
// });

Route::post('/ai/slug', [ShortenLinkController::class, 'generateSlug']);

// =====================================
// Public Routes
// =====================================

// Halaman awal → Login
Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('projects.index');
    }

    return Inertia::render('Auth/Login');
})->name('login');

// Shorten link publik
Route::get('/s/{code}', [ShortenLinkController::class, 'redirect'])->name('shorten.redirect');

// Show project by slug
Route::get('/m/{slug}', [ProjectController::class, 'showBySlug'])->name('projects.showBySlug');


// =====================================
// Authenticated Routes (with email verification middleware support)
// =====================================
Route::middleware(['auth'])->group(function () {

    // Email Verification Routes
    // Route::get('/email/verify', function () {
    //     return Inertia::render('Auth/VerifyEmail', [
    //         'status' => session('status'),
    //     ]);
    // })->name('verification.notice');

    // Route::get('/email/verify/{id}/{hash}', VerifyEmailController::class)
    //     ->middleware(['signed'])
    //     ->name('verification.verify');

    // Route::post('/email/verification-notification', function (Request $request) {
    //     $request->user()->sendEmailVerificationNotification();
    //     return back()->with('status', 'verification-link-sent');
    // })->middleware('throttle:6,1')->name('verification.send');


    // ==========================
    // Profile Management
    // ==========================
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });


    // ==========================
    // Projects & Links
    // ==========================
    Route::prefix('projects')->name('projects.')->group(function () {
        Route::get('/', [ProjectController::class, 'index'])->name('index');
        Route::get('/create', [ProjectController::class, 'create'])->name('create');
        Route::post('/', [ProjectController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [ProjectController::class, 'edit'])->name('edit');
        Route::patch('/{id}', [ProjectController::class, 'update'])->name('update');
        Route::delete('/{id}', [ProjectController::class, 'destroy'])->name('destroy');
        Route::delete('/bulk-delete', [ProjectController::class, 'bulkDelete'])->name('bulk-delete');

        // Nested: Links
        Route::prefix('{project}/links')->name('links.')->group(function () {
            Route::get('/', [LinkController::class, 'index'])->name('index');
            Route::get('/create', [LinkController::class, 'create'])->name('create');
            Route::post('/', [LinkController::class, 'store'])->name('store');
            Route::get('/{link}/edit', [LinkController::class, 'edit'])->name('edit');
            Route::patch('/{link}', [LinkController::class, 'update'])->name('update');
            Route::delete('/{link}', [LinkController::class, 'destroy'])->name('destroy');
        });

        // Nested: Categories
        Route::get('{project}/categories', [CategoryController::class, 'index'])->name('categories.index');
        Route::get('{project}/categories/create', [CategoryController::class, 'create'])->name('categories.create');
        Route::post('{project}/categories', [CategoryController::class, 'store'])->name('categories.store');
        Route::patch('{project}/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
        Route::delete('{project}/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

        // Links by Category
        Route::get('{project}/categories/{category}/links', [LinkController::class, 'indexByCategory'])->name('categories.links.index');
    });


    // ==========================
    // Shorten Links
    // ==========================
    Route::prefix('shorten')->name('shorten.')->group(function () {
        Route::get('/', [ShortenLinkController::class, 'index'])->name('index');
        Route::get('/create', [ShortenLinkController::class, 'create'])->name('create');
        Route::post('/', [ShortenLinkController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [ShortenLinkController::class, 'edit'])->name('edit');
        Route::patch('/{id}', [ShortenLinkController::class, 'update'])->name('update');
        Route::delete('/{id}', [ShortenLinkController::class, 'destroy'])->name('destroy');
    });
});


// =====================================
// Auth Routes (Login, Register, etc.)
// =====================================
require __DIR__ . '/auth.php';