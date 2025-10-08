<?php

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\DomainController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\RedirectController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ShortenLinkController;
use App\Http\Controllers\Auth\Web3AuthController;
use App\Http\Controllers\ProjectPublicController;
// use App\Http\Controllers\Auth\VerifyEmailController;
// use Symfony\Component\HttpKernel\Exception\HttpException;

Route::post('/web3/nonce', [Web3AuthController::class, 'nonce']);
Route::post('/web3/verify', [Web3AuthController::class, 'verify']);

// =====================================
// AI Sugestions Routes
// =====================================
Route::post('/ai/slug', [ShortenLinkController::class, 'generateSlug']);
Route::post('/ai/project-slug', [ProjectController::class, 'generateSlug'])->name('projects.ai.slug');

// =====================================
// Public Routes
// =====================================

// Halaman awal → Login
Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard.index');
    }

    return Inertia::render('Auth/Login');
})->name('login');

// Shorten link publik
Route::get('/s/{code}', RedirectController::class)->name('redirect');

// Show project by slug
Route::get('/m/{slug}', [ProjectPublicController::class, 'showBySlug'])->name('projects.showBySlug');

// Validasi password short link (public)
Route::post('/validate-password', [ShortenLinkController::class, 'validatePassword'])
    ->name('shorten.validate');

// Validasi password project (public)
Route::post('/projects/{slug}/verify-password', [ProjectPublicController::class, 'verifyPassword'])->name('projects.verifyPassword');

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
    // Dashboard Management
    // ==========================
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');

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

    Route::prefix('domains')->name('domains.')->group(function () {
        Route::get('/', [DomainController::class, 'index'])->name('index');
        Route::post('/', [DomainController::class, 'store'])->name('store');
        Route::post('/{id}/verify', [DomainController::class, 'verify'])->name('verify');
        Route::delete('/{id}', [DomainController::class, 'destroy'])->name('destroy');
    });
});


// =====================================
// Auth Routes (Login, Register, etc.)
// =====================================
require __DIR__ . '/auth.php';
