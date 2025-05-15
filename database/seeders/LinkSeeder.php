<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class LinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Ambil user_id dan project_id yang sudah ada
        $users = DB::table('users')->pluck('id')->toArray();
        $projects = DB::table('projects')->pluck('id')->toArray();
        $categories = DB::table('categories')->pluck('id')->toArray();

        // Pastikan ada data user dan project sebelum menjalankan seeder
        if (empty($users) || empty($projects)) {
            $this->command->warn('Seeder dihentikan: Tidak ada user atau project yang tersedia.');
            return;
        }

        // Nonaktifkan foreign key constraint sebelum truncate
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('links')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Generate 50 link dummy
        for ($i = 0; $i < 50; $i++) {
            DB::table('links')->insert([
                'user_id' => $faker->randomElement($users),
                'project_id' => $faker->randomElement($projects),
                'category_id' => $faker->randomElement($categories) ?? null,
                'title' => $faker->sentence(3),
                'original_url' => $faker->url,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}