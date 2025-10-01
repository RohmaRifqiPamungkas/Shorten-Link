<?php

namespace App\Services;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GroqService
{
    protected $apiKey;
    protected $baseUrl = 'https://api.groq.com/openai/v1/chat/completions';

    public function __construct()
    {
        $this->apiKey = env('GROQ_API_KEY');
    }

    /**
     * Generate slug singkat berdasarkan input (bisa URL, nama project, atau teks biasa).
     */
    public function suggestSlug(string $input): string
    {
        $prompt = "Buat 1 slug singkat (maksimal 10 karakter, huruf kecil, tanpa spasi, tanpa simbol selain -) 
                   berdasarkan teks berikut: \"$input\". 
                   Bisa berupa nama project, judul, atau URL. 
                   Jawab hanya slug saja, tanpa tambahan kalimat.";

        $response = Http::withToken($this->apiKey)->post($this->baseUrl, [
            'model' => 'llama-3.1-8b-instant',
            'messages' => [
                ['role' => 'system', 'content' => 'Kamu adalah AI pembuat slug unik.'],
                ['role' => 'user', 'content' => $prompt],
            ],
            'max_tokens' => 20,
            'temperature' => 0.7,
        ]);

        if ($response->failed()) {
            Log::error("Groq API Error", $response->json());
            return '';
        }

        $content = trim($response->json('choices.0.message.content') ?? '');

        // Bersihkan hasil: ambil hanya alfanumerik dan dash
        $slug = Str::slug($content, '-');

        // batasi max 10 karakter biar sesuai aturan
        return substr($slug, 0, 10);
    }
}
