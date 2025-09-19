<?php

namespace App\Services;

use Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log as alias;

class GroqService
{
    protected $apiKey;
    protected $baseUrl = 'https://api.groq.com/openai/v1/chat/completions';

    public function __construct()
    {
        $this->apiKey = env('GROQ_API_KEY');
    }

    public function suggestSlug(string $url): string
    {
        $prompt = "Buat 1 slug singkat (maksimal 10 karakter, huruf kecil, tanpa spasi, tanpa simbol selain -), untuk URL berikut: $url. Jawab hanya slug saja, jangan dengan kalimat.";

        $response = Http::withToken($this->apiKey)->post($this->baseUrl, [
            'model' => 'llama-3.1-8b-instant',
            'messages' => [
                ['role' => 'system', 'content' => 'Kamu adalah AI pembuat slug URL.'],
                ['role' => 'user', 'content' => $prompt],
            ],
            'max_tokens' => 20,
            'temperature' => 0.7,
        ]);

        if ($response->failed()) {
            alias::error("Groq API Error", $response->json());
            return '';
        }

        $content = trim($response->json('choices.0.message.content') ?? '');

        // Bersihkan hasil: ambil hanya alfanumerik dan dash
        $slug = Str::slug($content, '-');

        return substr($slug, 0, 10); // maksimal 10 karakter
    }
}
