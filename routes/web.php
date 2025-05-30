<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ShortenLinkController;

// Halaman Awal (Login)
Route::get('/', function () {
    return Inertia::render('Auth/Login');
});

// Redirect Shorten Link Publik
Route::get('/s/{code}', [ShortenLinkController::class, 'redirect'])->name('shorten.redirect');

// Route yang memerlukan autentikasi
Route::middleware(['auth'])->group(function () {

    // Profile
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });

    // Tampilkan proyek berdasarkan slug (publik)
    Route::get('/m/{slug}', [ProjectController::class, 'showBySlug'])->name('projects.showBySlug');

    // Projects (CRUD)
    Route::prefix('projects')->name('projects.')->group(function () {
        Route::get('/', [ProjectController::class, 'index'])->name('index');
        Route::get('/create', [ProjectController::class, 'create'])->name('create');
        Route::post('/', [ProjectController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [ProjectController::class, 'edit'])->name('edit');
        Route::patch('/{id}', [ProjectController::class, 'update'])->name('update');
        Route::delete('/{id}', [ProjectController::class, 'destroy'])->name('destroy');

        // Link dalam project (nested)
        Route::prefix('{project}/links')->name('links.')->group(function () {
            Route::get('/', [LinkController::class, 'index'])->name('index');
            Route::get('/create', [LinkController::class, 'create'])->name('create');
            Route::post('/', [LinkController::class, 'store'])->name('store');
        });

        // Kategori dalam project
        Route::get('{project}/categories', [CategoryController::class, 'index'])->name('categories.index');
        Route::get('{project}/categories/create', [CategoryController::class, 'create'])->name('categories.create');
        Route::post('{project}/categories', [CategoryController::class, 'store'])->name('categories.store'); 

        // Link berdasarkan kategori
        Route::get('{project}/categories/{category}/links', [LinkController::class, 'indexByCategory'])->name('categories.links.index');
    });

    // Shorten Link (CRUD)
    Route::prefix('shorten')->name('shorten.')->group(function () {
        Route::get('/', [ShortenLinkController::class, 'index'])->name('index');
        Route::get('/create', [ShortenLinkController::class, 'create'])->name('create');
        Route::get('/{id}/edit', [ShortenLinkController::class, 'edit'])->name('shorten.edit');
        Route::patch('/{id}', [ShortenLinkController::class, 'update'])->name('shorten.update');
        Route::post('/', [ShortenLinkController::class, 'store'])->name('store');
        Route::delete('/{id}', [ShortenLinkController::class, 'destroy'])->name('destroy');
    });

    // Hapus link (jika ingin, bisa tambahkan route delete khusus di sini)
    // Route::delete('/projects/links/{link}', [LinkController::class, 'destroy'])->name('projects.links.destroy');
});

require __DIR__ . '/auth.php';