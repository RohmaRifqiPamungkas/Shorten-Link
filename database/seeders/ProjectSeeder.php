<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Ambil semua user_id dari tabel users
        $users = DB::table('users')->pluck('id')->toArray();

        if (empty($users)) {
            exit("Seeder dihentikan: Tidak ada user yang tersedia.\n");
        }

        // Insert beberapa project dummy
        $projects = [];
        foreach ($users as $user_id) {
            for ($i = 1; $i <= 3; $i++) { // Setiap user punya 3 project
                $projectName = "Project User {$user_id} - {$i}";
                $projects[] = [
                    'user_id' => $user_id,
                    'project_name' => $projectName,
                    'project_slug' => Str::slug($projectName) . '-' . Str::random(5),
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('projects')->insert($projects);
    }
}