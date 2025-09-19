<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AI\SlugController;

Route::post('/ai/slug', [SlugController::class, 'generate']);

Route::get('/test', function () {
    return response()->json(['message' => 'API route aktif']);
});