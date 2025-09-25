<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('domains', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');
            $table->string('domain')->unique(); // contoh: mybrand.link
            $table->string('verification_token')->nullable(); // token verifikasi via DNS
            $table->timestamp('verified_at')->nullable();
            $table->enum('status', ['pending', 'active', 'failed'])->default('pending');
            $table->string('custom_index_url')->nullable(); // redirect jika root domain diakses
            $table->string('custom_404_url')->nullable();   // redirect jika slug tidak ditemukan
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('domains');
    }
};
