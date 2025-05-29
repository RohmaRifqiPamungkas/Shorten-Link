<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use Inertia\Inertia;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ShortenLinkController;

// Halaman Awal
Route::get('/', function () {
    return Inertia::render('Auth/Login');
});

// Dashboard
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

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
    Route::prefix('dashboard/projects')->name('projects.')->group(function () {
        Route::get('/', [ProjectController::class, 'index'])->name('index');
        Route::get('/create', [ProjectController::class, 'create'])->name('create');
        Route::post('/', [ProjectController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [ProjectController::class, 'edit'])->name('edit');
        Route::patch('/{id}', [ProjectController::class, 'update'])->name('update');
        Route::delete('/{id}', [ProjectController::class, 'destroy'])->name('destroy');

        // Route link dalam project (nested)
        Route::prefix('/{project}/links')->name('links.')->group(function () {
            Route::get('/', [LinkController::class, 'index'])->name('index');
            Route::get('/create', [LinkController::class, 'create'])->name('create');
            Route::post('/', [LinkController::class, 'store'])->name('store');
        });

        // Route kategori berdasarkan project (GET)
        Route::get('/{project}/categories/create', [CategoryController::class, 'create'])->name('categories.create');

        Route::get('/{project}/categories', [CategoryController::class, 'index'])->name('categories.index');
    });

    // Shorten Link (CRUD)
    Route::prefix('dashboard/shorten')->name('shorten.')->group(function () {
        Route::get('/', [ShortenLinkController::class, 'index'])->name('index');
        Route::get('/create', [ShortenLinkController::class, 'create'])->name('create');
        Route::get('/{id}/edit', [ShortenLinkController::class, 'edit'])->name('shorten.edit');
        Route::patch('/{id}', [ShortenLinkController::class, 'update'])->name('shorten.update');
        Route::post('/', [ShortenLinkController::class, 'store'])->name('store');
        Route::delete('/{id}', [ShortenLinkController::class, 'destroy'])->name('destroy');
    });

    // Simpan kategori baru (POST)
    Route::post('/dashboard/projects/{project}/categories', [CategoryController::class, 'store'])->name('categories.store');

    // Hapus link (terpisah karena tidak perlu ID project)
    Route::delete('/dashboard/projects/links/{link}', [LinkController::class, 'destroy'])->name('projects.links.destroy');
});

require __DIR__ . '/auth.php';