<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Ambil semua user dan project yang ada
        $users = DB::table('users')->pluck('id')->toArray();
        $projects = DB::table('projects')->pluck('id')->toArray();

        if (empty($users) || empty($projects)) {
            $this->command->warn('Seeder dihentikan: Tidak ada user atau project yang tersedia.');
            return;
        }

        // Nonaktifkan foreign key dan truncate tabel categories
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('categories')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Masukkan data dummy ke tabel categories
        $categories = [];
        foreach ($projects as $project_id) {
            $user_id = DB::table('projects')->where('id', $project_id)->value('user_id');

            for ($i = 0; $i < 3; $i++) { // Setiap project punya 3 kategori
                $categories[] = [
                    'user_id' => $user_id,
                    'project_id' => $project_id,
                    'name' => $faker->word,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('categories')->insert($categories);
    }
}